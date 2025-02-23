import React, { useState } from 'react'
import type { Member } from '@/type'

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
    <div>
      <div className="text-xl flex justify-around m-10">Upload CSV</div>
      <form>
        <input
          type={'file'}
          id={'csvFileInput'}
          accept={'.csv'}
          onChange={handleOnChange}
        />

        <button
          className="p-2 mr-4 rounded outline outline-offset-2"
          onClick={(e) => {
            handleOnSubmit(e)
          }}
        >
          IMPORT CSV
        </button>
      </form>
    </div>
  )
}

export default UploadCsv
