import React from 'react';

class MerchantDashboard extends React.Component {
  state = {
    contentHeight: 0
  }

  componentDidMount(){
    document.title = "SFA OTTO - Merchant Dashboard"

    let newContentHeight = window.innerHeight - 65

    this.setState({contentHeight: newContentHeight})
  }

  render() {
    return (
      <div style={{marginTop: "-20px"}}>
        <iframe width="100%" height={this.state.contentHeight} src="https://datastudio.google.com/embed/reporting/11SRRm1EwRKrJvcfILjyPPU3pAUrR9RKW/page/VW5w" frameBorder="0" style={{border: 0}} allowFullscreen></iframe>
      </div>
    )
}}

export default MerchantDashboard