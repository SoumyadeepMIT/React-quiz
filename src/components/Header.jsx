import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div>
        <header className="header">
            <h1>Which Element are you?</h1>
            <p>(based on completely random things)</p>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/quiz">Quiz</Link>  
            </nav>
        </header>
    </div>
  )
}
