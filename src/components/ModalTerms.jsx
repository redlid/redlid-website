import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Link } from 'wouter'
import TermsContent from './TermsContent'

export default ({ show, onHide, onShowPrivacy }) => {
  const privacyLink = onShowPrivacy ? (
    <Button
      variant="link"
      className="TermsModalBtn"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onShowPrivacy()
      }}
    >
      Privacy Policy
    </Button>
  ) : (
    <Link href="/privacy" className="TermsModalBtn" onClick={onHide}>
      Privacy Policy
    </Link>
  )

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Bins & Bags Terms and conditions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TermsContent privacyLink={privacyLink} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
