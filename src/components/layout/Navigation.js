import React from 'react'
import { Link } from 'react-router-dom'

import { Navbar, Nav } from 'react-bootstrap'

const Navigation = () => {


   return (
      <Navbar bg='light' expand='lg'>
         <Navbar.Brand className='mx-3'><Link to="/" className='text-secondary'><h4>Template</h4></Link></Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='w-100'>
            </Nav>
         </Navbar.Collapse>
      </Navbar>
   )
}

export default Navigation
