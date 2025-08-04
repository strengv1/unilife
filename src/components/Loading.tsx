export const Loading = ({ text }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">{text ? text : 'Loading...'}</div>
  )
}