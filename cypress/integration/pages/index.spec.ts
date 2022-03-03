describe('Init cypress', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.viewport(1280, 1000)
  })
  it('Show main title', () => {
    cy.get('[data-testid=title]').contains('Mictodo')
  })
})

// Notes: This `export` for fix this error message
// Error message: 'index.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file.
// Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {}
