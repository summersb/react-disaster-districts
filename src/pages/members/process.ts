import type { Member } from '@/type'

  enum Mode {
    name, address, address2, city, geo, unk
  }

  export function parseData(data: string): Member[] {
    const persons: Member[] = [];

    // Split the data into individual sections based on double newline characters
    const sections = data.trim().split('\n\n');

    // Regular expressions to match each section
    const headerRegex = /^[A-Za-z ]+ - \d*$/
    const seperatorRegex = /^[A-Z]$/
    const nameAddressRegex = /^([A-Za-z\-\s]+),\s([()A-Za-z&.\s]+)\s?(\d+\s*[A-Za-z0-9-/#.\s.]*)?$/
    const cityRexex = /^(Vista|VISTA),\s([A-Za-z]+)\s(\d*)\s?-?(\d*)?$/
    const latLngRegex = /^(-?\d+\.\d+),\s(-?\d+\.\d+)$/

    let mode = Mode.unk
    let member: Member = {}
    sections.forEach(section => {
      const header = headerRegex.exec(section)
      if (header) {
        return
      }
      if (section.includes("All rights reserved")) {
        return
      }
      if (seperatorRegex.exec(section)) {
        return
      }
      const nameAddressMatch = nameAddressRegex.exec(section)
      const cityMatch = cityRexex.exec(section)
      const latLngMatch = latLngRegex.exec(section)

      if (member.familyName && nameAddressMatch && !cityMatch) {
        mode = Mode.unk
        persons.push(member);
        member = {}
      }

      if (mode === Mode.unk && nameAddressMatch) {
        mode = Mode.name
        member.familyName = nameAddressMatch[1]
        member.name = nameAddressMatch[2]
        if (nameAddressMatch[3]) {
          member.address1 = nameAddressMatch[3]
        }
        return;
      }


      if (!cityMatch && !latLngMatch) {
        mode = Mode.address2
        member.address2 = section
        return;
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

    })

    if (member.familyName) { persons.push(member) }
    return persons;
  }
