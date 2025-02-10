import React from 'react'
import { Button } from '@/components/ui/button.tsx'
import { useQuery } from '@tanstack/react-query'
import { getWardList } from '@/api/wardApi.ts'
import { WardConfig } from '@/type/Ward.ts'
import { useLocalStorageState } from '@/hooks/useLocalStorageState.tsx'
import DownloadWard from '@/pages/home/DownloadWard.tsx'
import WardPermissions from '@/pages/home/WardPermissions.tsx'

const SelectWard = (): React.ReactElement => {
  const [, setActiveWard] = useLocalStorageState<WardConfig>('ward', undefined)
  const { data } = useQuery({ queryKey: ['wardList'], queryFn: getWardList })
  const select = (ward: string, name: string) => {
    setActiveWard({ wardId: ward, wardName: name })
  }

  return (
    <div>
      Choose Ward
      {data?.map((wc) => (
        <Button key={wc.wardId} onClick={() => select(wc.wardId, wc.wardName)}>
          {wc.wardName}
        </Button>
      ))}
      <DownloadWard />
      <WardPermissions />
    </div>
  )
}

export default SelectWard
