describe('Checklist Group', () => {
  const waitTimeBeforeAssert: number = 2000
  beforeEach(() => {
    cy.then(() => {
      window.localStorage.setItem(Cypress.env('localStorageKey'), Cypress.env('localStorageValue'))
    })
    cy.visit('http://localhost:3000/dashboard')
    cy.viewport(1280, 1000)
  })
  afterEach(() => {
    // Notes: .pause() is used to wait for the animation to finish (check your testis right)
    // cy.pause()
  })
  it('Success set account data on your .env file (fake login)', () => {
    expect(Cypress.env('localStorageKey')).to.equal('supabase.auth.token')
    expect(Cypress.env('localStorageValue')).to.not.equal('')
  })
  it('Success go to dashboard', () => {
    cy.contains('Hallo')
    cy.get('[data-testid=checklist-group-form').should('be.visible')
  })
  it('Success create checklist group', () => {
    // Notes: Add checklist-group
    cy.get('[data-testid=checklist-group-form').should('be.visible')
    cy.get('[data-testid=checklist-group-input]').type('Workout!')
    cy.get('[data-testid=checklist-group-form]').submit()
    // Assertion: Checklist group is created
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=checklist-group-unit]').should('be.visible')
    cy.get('[data-testid=checklist-group-unit]').should('have.length', 1)
  })
  it('Success remove checklist group', () => {
    // Notes: Check checklist-group
    cy.get('[data-testid=checklist-group-unit]').should('be.visible')
    cy.get('[data-testid=checklist-group-unit]').should('have.length', 1)
    // Notes: Delete checklist-group
    cy.get('[data-testid=checklist-group-unit]').click()
    cy.get('[data-testid=btn-remove-checklist-group-unit]').click()
    cy.wait(waitTimeBeforeAssert)
    // Assertion: Checklist group is deleted
    cy.get('[data-testid=checklist-group-unit]').should('not.exist')
  })
  it('Success create multiple checklist group', () => {
    // Notes: Add checklist-group
    cy.get('[data-testid=checklist-group-form').should('be.visible')
    cy.wrap(['React', 'Vue', 'Svelte']).each((el) => {
      cy.get('[data-testid=checklist-group-input]').type(JSON.stringify(el))
      cy.get('[data-testid=checklist-group-form]').submit()
    })
    // Assertion: Checklist group is created
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=checklist-group-unit]').should('have.length', 3)
  })
  it('Success checklist group checked', () => {
    cy.get('[data-testid=checklist-group-unit]').should('have.length', 3)
    cy.get('[aria-label=checklist-group-checkbox]').each(($el, index) => {
      if (index % 2 === 0) {
        cy.wrap($el).check({ force: true })
      }
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[aria-label=checklist-group-checkbox]').each(($el, index) => {
      if (index % 2 === 0) {
        cy.wrap($el).should('be.checked')
      }
    })
  })
  it('Success remove multiple checklist group', () => {
    // Notes: Check checklist-group
    cy.get('[data-testid=checklist-group-unit]').should('have.length', 3)
    // Notes: Delete checklist-group
    cy.get('[data-testid=checklist-group-unit]').each(($el) => {
      cy.wrap($el).click()
      cy.get('[data-testid=btn-remove-checklist-group-unit]').click()
    })
    // Assertion: Checklist group is deleted
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=checklist-group-unit]').should('not.exist')
  })
})

// Notes: This `export` for fix this error message
// Error message: 'index.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file.
// Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {}
