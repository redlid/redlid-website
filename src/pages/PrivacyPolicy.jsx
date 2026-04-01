import React from 'react'
import Container from 'react-bootstrap/Container'
import PrivacyContent from '../components/PrivacyContent'

export default function PrivacyPolicy() {
  return (
    <Container className="pdpHelptext">
      <h1 className="blacklabel">Privacy Policy</h1>
      <PrivacyContent />
    </Container>
  )
}
