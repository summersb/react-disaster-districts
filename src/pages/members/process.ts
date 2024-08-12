import type { Member, Result } from '@/type'

enum Mode {
  name,
  address,
  address2,
  city,
  geo,
  unk,
}

export function parseData(data: string): Partial<Member>[] {
  const persons: Partial<Member>[] = []

  // Split the data into individual sections based on double newline characters
  const sections = data.trim().split('\n')

  // Regular expressions to match each section
  const headerRegex = /^[A-Za-z ]+ - \d*$/
  const separatorRegex = /^[A-Z]$/
  const footerRegex = /^https.*$/
  const nameAddressRegex =
    /^([A-Za-z\-\s]+),\s([()A-Za-z&.\s]+)\s?(\d+\s*[A-Za-z0-9-/#.\s]*)?$/
  const cityRegex = /^(Vista|VISTA|San Marcos),\s([A-Za-z]+)\s(\d*)\s?-?(\d*)?$/
  const latLngRegex = /^(-?\d+\.\d+),\s(-?\d+\.\d+)$/

  let mode = Mode.unk
  let member: Partial<Member> = {}
  sections.forEach((section) => {
    const header = headerRegex.exec(section)
    if (header) {
      return
    }
    const footer = footerRegex.exec(section)
    if (footer) {
      return
    }
    if (section.includes('All rights reserved')) {
      return
    }
    if (section.includes('Ward Directory and Map')) {
      return
    }
    if (separatorRegex.exec(section)) {
      return
    }
    const nameAddressMatch = nameAddressRegex.exec(section)
    const cityMatch = cityRegex.exec(section)
    const latLngMatch = latLngRegex.exec(section)

    if (member.familyName && nameAddressMatch && !cityMatch) {
      mode = Mode.unk
      console.log('Pushed person', member)
      persons.push(member as Member)
      member = {}
    }

    if (mode === Mode.unk && nameAddressMatch) {
      mode = Mode.name
      member.familyName = nameAddressMatch[1]
      member.name = nameAddressMatch[2].trim()
      if (nameAddressMatch[3]) {
        member.address1 = nameAddressMatch[3].trim()
      }
      return
    }

    if (!cityMatch && !latLngMatch) {
      mode = Mode.address2
      member.address2 = section
      return
    }

    if (cityMatch) {
      mode = Mode.city
      member.city = cityMatch[1]
      member.state = cityMatch[2]
      member.postalCode = Number(cityMatch[3])
      //        if (cityMatch[4]) {
      //          member.zip2 = Number(cityMatch[4])
      //        }
      return
    }
    if (latLngMatch) {
      mode = Mode.geo
      member.lat = Number(latLngMatch[1])
      member.lng = Number(latLngMatch[2])
      return
    }
    console.log('No match found', section)
  })

  if (member.familyName) {
    console.log('last person', member)
    persons.push(member)
  }
  return persons
}

export const resolveAddress = async (address: string): Promise<Result> =>
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`,
  )
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        throw new Error('Error resolving ' + res.statusText)
      }
    })
    .then((json) => {
      if (json.status === 'OK') {
        return json.results[0]
      } else {
        throw new Error('Could not resolve address' + address)
      }
    })
    .catch((e) => {
      alert(e.message)
    })

export const getGeo = async (
  member: Partial<Member>,
): Promise<Partial<Member>> => {
  if (member.lat === undefined || member.lng === undefined) {
    const address = await resolveAddress(
      `${member.address1},${member.address2 === '' ? '' : member.address2 + ','}${member.city},${member.state}`,
    )

    member.formattedAddress = address.formatted_address
    member.lat = address.geometry.location.lat
    member.lng = address.geometry.location.lng
    member.postalCode = parseInt(
      address?.address_components?.find(
        (addressComponent) => addressComponent.types[0] === 'postal_code',
      )?.long_name ?? '0',
    )
  }

  return member
}
