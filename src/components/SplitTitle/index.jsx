function SplitTitle({ first, second, as: Heading = 'h2' }) {
  return (
    <Heading className="split_title">
      {first}
      <span>{second}</span>
    </Heading>
  )
}

export default SplitTitle
