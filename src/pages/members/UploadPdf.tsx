import React, { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { Member } from '@/type'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import Paper from '@/components/styled/Paper'
import StyledButton from '@/components/styled/StyledButton.tsx'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

//pdfjsLib.GlobalWorkerOptions.workerSrc =
//  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js'

const headerRegex = /^[A-Za-z ]+ - \d*$/
const separatorRegex = /^[A-Z]$/

type UploadPdfProps = {
  setMembers: (members: Member[]) => void
}

const UploadPdf = ({ setMembers }: UploadPdfProps): React.ReactElement => {
  const [pdfFile, setPdfFile] = useState<File | null>()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfFile(e.target.files?.[0])
  }

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    const fileReader = new FileReader()
    if (!pdfFile) {
      return
    }

    fileReader.onload = async function () {
      const pdfData = new Uint8Array(fileReader.result as ArrayBuffer)
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise

      const lines = []
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)

        const content = await page.getTextContent()
        for (const item of content.items) {
          if ('str' in item && item.str.trim() !== '') {
            const val = item.str.trim()
            if (val === '©') {
              continue
            }
            if (val.includes('All rights reserved')) {
              continue
            }
            if (val.includes('Church Use Only')) {
              continue
            }
            if (headerRegex.exec(val)) {
              continue
            }
            if (separatorRegex.exec(val)) {
              continue
            }
            lines.push(item.str)
            //console.log(item.str)
          }
        }
      }
      setMembers(parseMemberList(lines))
    }

    fileReader.readAsArrayBuffer(pdfFile)
  }

  function parseMemberList(list: string[]) {
    const cityRegex = /^([\w\s]+),\s([A-Za-z]+)\s(\d*)\s?-?\s?(\d*)?$/
    const members: Member[] = []

    for (let i = 0; i < list.length; ) {
      if (!list[i] || !list[i].includes(',')) {
        console.log('Missing or invalid name at index', i, list[i])
        i++
        continue
      }
      const name = list[i].split(',')
      const temp: Partial<Member> = {
        familyName: name[0]?.trim(),
        name: name?.[1]?.trim(),
      }
      i++
      if (list[i] && list[i].includes(',')) {
        // If the next line is not an address, process the member immediately
      } else {
        // Process address details only if they exist
        if (list[i] && !list[i].includes(',')) {
          temp.address1 = list[i]
          i++
        }
        if (list[i] && !list[i].includes(',')) {
          temp.address2 = list[i]
          i++
        }
        if (
          list[i] &&
          list[i].includes(',') &&
          isNaN(Number(list[i].split(',')[0]))
        ) {
          const city = cityRegex.exec(list[i])
          if (city) {
            temp.city = city[1] || ''
            temp.state = city[2] || ''
            temp.postalCode = city[3] || ''
          }
          i++
        }
        if (
          list[i] &&
          list[i].includes(',') &&
          !isNaN(Number(list[i].split(',')[0]))
        ) {
          const latLng = list[i].split(',')
          temp.lat = Number(latLng[0])
          temp.lng = Number(latLng[1])
          i++
        }
      }

      const member: Member = {
        id: crypto.randomUUID(),
        familyName: temp.name ?? '',
        ...temp,
      } as Member

      members.push(member as Member)
    }

    return members
  }

  return (
    <>
      <div className="text-xl flex justify-center m-10">Upload PDF</div>
      <div className="flex">
        <Paper width="w-1/2">
          <ul className="mb-6">
            <li>
              From{' '}
              <a
                href="https://directory.churchofjesuschrist.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                https://directory.churchofjesuschrist.org
              </a>
            </li>
            <li>Print your wards member list</li>
            <li>Select "Full Address" and check "Show Latitude/Longitude"</li>
            <li>Then print to a file and upload that file</li>
          </ul>
          <form>
            <input
              type="file"
              id="pdfFileInput"
              accept=".pdf"
              onChange={onChange}
              className="mb-4 p-2 border rounded-md bg-gray-700 text-white"
            />
            <StyledButton onClick={onSubmit}>IMPORT PDF</StyledButton>
          </form>
        </Paper>
        <div className="w-1/2 p-4">
          <img
            src="/images/print-ward.png"
            alt="Show how to print PDF report"
            className="h-[600px] w-auto object-contain"
          />
        </div>
      </div>
    </>
  )
}

export default UploadPdf
