describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.viewport(1280, 1000)
  })
  it('Login page looks good', () => {
    cy.contains('Mictodo')
    cy.contains('Login with Google')
  })
  it('Unauthorized user', () => {
    cy.visit('http://localhost:3000/dashboard')
    cy.contains('Back to Home').click()
  })
  it('Authorized user', () => {
    // Notes: Get user data (manual assignt)
    window.localStorage.setItem(Cypress.env('localStorageKey'), Cypress.env('localStorageValue'))
    cy.visit('http://localhost:3000/dashboard')
    cy.contains('Hallo')
  })
})

// Notes: This `export` for fix this error message
// Error message: 'index.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file.
// Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {}
