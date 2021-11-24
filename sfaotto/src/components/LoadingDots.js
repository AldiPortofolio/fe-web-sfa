import React from 'react'
import '../css/spinner.css'

class LoadingDots extends React.Component {
  render() {
    const { color } = this.props

    return (
      // <div className={`loading-dots ${color}`} style={{height: '80vh', width: '60vw'}}>
      <div className={`loading-dots ${color}`}>
        <div className="dot-flashing"></div>
      </div>
    )
  }
}

export default LoadingDots
