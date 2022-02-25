import React from 'react'
import './linkButton.less'

export default function LinkButton(props) {
  return <button {...props} className='linkButton'>{props.children}</button>
}
