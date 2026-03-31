import * as React from 'react'
import { Switch, Route } from 'wouter'
import Bins from '../pages/Bins'
import BinsBags from '../pages/BinsBags'
import Bags from '../pages/Bags'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsConditions from '../pages/TermsConditions'
import EmailOrderFailure from '../pages/EmailOrderFailure'
import EmailOrderSuccess from '../pages/EmailOrderSuccess'

export default () => (
  <Switch>
    <Route path="/bins" component={Bins} />
    <Route path="/bags" component={Bags} />
    <Route path="/terms" component={TermsConditions} />
    <Route path="/privacy" component={PrivacyPolicy} />
    <Route path="/order-failure" component={EmailOrderFailure} />
    <Route path="/order-success" component={EmailOrderSuccess} />
    <Route component={BinsBags} />
  </Switch>
)
