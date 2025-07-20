import { render } from '@cedarjs/testing/web'

import Author from './Author'

const author = {
  email: 'test.user@email.com',
  fullName: 'Test User',
}

//   Improve this test with help from the Redwood Testing Doc:
//    https://cedarjs.com/docs/testing#testing-components

describe('Author', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Author author={author} />)
    }).not.toThrow()
  })
})
