


import React from 'react'
import { useParams } from 'react-router-dom'

const DeckDetails = () => {

    const { deckId } = useParams();

  return (
    <div>
        {deckId}
    </div>
  )
}

export default DeckDetails