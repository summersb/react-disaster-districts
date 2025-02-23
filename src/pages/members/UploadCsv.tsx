import React, { useState } from 'react'
import type { Member } from '@/type'
import Paper from '@/components/styled/Paper.tsx'

type UploadCsvProps = {
  setMembers: (members: Member[]) => void
}

const UploadCsv = ({ setMembers }: UploadCsvProps): React.ReactElement => {
  const [file, setFile] = useState()
  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.target.files[0])
  }

  const csvFileToArray = (str: string) => {
    const csvRows = str.slice(str.indexOf('\n') + 1).split('\n')

    const array: Member[] = csvRows.map((i) => {
      const values = i.split(';')
      const member: Member = {
        id: '0',
        familyName: values[0],
        name: values[1],
        formattedAddress: values[2],
        address1: values[3],
        address2: values[4],
        city: values[5],
        state: values[6],
        postalCode: values[7],
        phone: values[8],
        lat: Number(values[9]),
        lng: Number(values[10]),
      }
      return member
    })

    setMembers(array)
  }

  const handleOnSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target?.result
        if (text) {
          csvFileToArray(text as string)
        }
      }

      fileReader.readAsText(file)
    }
  }
  return (
    <>
      <div className="text-xl flex justify-around m-10">Upload CSV</div>
      <Paper>
        <form>
          <input
            type="file"
            id="csvFileInput"
            accept=".csv"
            onChange={handleOnChange}
            className="mb-4 p-2 border rounded-md bg-gray-700 text-white"
          />

          <button
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={(e) => {
              handleOnSubmit(e)
            }}
          >
            IMPORT CSV
          </button>
        </form>
      </Paper>
    </>
  )
}

export default UploadCsv
