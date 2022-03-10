describe('Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.viewport(1280, 1000)
  })
  afterEach(() => {
    // Notes: .pause() is used to wait for the animation to finish (check your testis right)
    // cy.pause()
  })
  it('Login page looks good', () => {
    cy.contains('Mictodo')
    cy.contains('Login with Google')
  })
  it('Unauthorized user', () => {
    cy.visit('http://localhost:3000/dashboard')
    cy.contains('Back to Home').click()
  })
  it('Success set account data on your .env file (fake login)', () => {
    expect(Cypress.env('localStorageKey')).to.equal('supabase.auth.token')
    expect(Cypress.env('localStorageValue')).to.not.equal('')
  })
  it('Authorized user', () => {
    // Notes: Get user data (manual assignt)
    cy.then(async () => {
      window.localStorage.setItem(Cypress.env('localStorageKey'), Cypress.env('localStorageValue'))
      cy.visit('http://localhost:3000/dashboard')
    })
    cy.contains('Hallo')
  })
})

// Notes: This `export` for fix this error message
// Error message: 'index.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file.
// Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {}
