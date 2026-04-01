import React from 'react'
import Container from 'react-bootstrap/Container'
import TermsContent from '../components/TermsContent'

export default function TermsConditions() {
  return (
    <Container className="pdpHelptext">
      <h1 className="blacklabel">Terms & Conditions</h1>
      <TermsContent />
    </Container>
  )
}
