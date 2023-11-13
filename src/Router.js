import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import ContentPanel from './components/content/ContentPanel'
import Navigation from './components/layout/Navigation'
import { Container } from 'react-bootstrap'

const Router = () => {

   return (
      <BrowserRouter>
         <Navigation />
         <Container>
            <Switch>
               <Route exact path="/">
                  <h1 className="w-100 text-center mt-5">Home</h1>
                  <ContentPanel />
               </Route>
            </Switch>
         </Container>
      </BrowserRouter>
   )
}

export default Router
