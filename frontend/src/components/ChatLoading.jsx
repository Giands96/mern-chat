import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

export const ChatLoading = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <p>
      <Skeleton count={10} />
    </p>
  </SkeletonTheme>
  )
}
