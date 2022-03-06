describe('Checklist Item', () => {
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
  it('Should exits user data on .env file for fake login', () => {
    expect(Cypress.env('localStorageKey')).to.equal('supabase.auth.token')
    expect(Cypress.env('localStorageValue')).to.not.equal('')
  })
  it('Should show dashboard page', () => {
    cy.contains('Hallo')
    cy.get('[data-testid=checklist-group-form').should('be.visible')
  })
  it('Should create one checklist group', () => {
    cy.get('[data-testid=checklist-group-form').should('be.visible')
    cy.get('[data-testid=checklist-group-input]').type('Workout!')
    cy.get('[data-testid=checklist-group-form]').submit()
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=checklist-group-unit]').should('be.visible')
    cy.get('[data-testid=checklist-group-unit]').should('have.length', 1)
  })
  it('Should create, remove, and checked multiple checklist item', () => {
    cy.get('[data-testid=checklist-group-unit]').should('be.visible')
    cy.get('[data-testid=checklist-group-unit]').should('have.length', 1)
    cy.get('[data-testid=checklist-group-unit]').click()
    cy.get('[data-testid=checklist-item-form').should('be.visible')
    cy.wrap(['Sit-up', 'Push-up', 'Pull-up']).each(($el) => {
      cy.get('[data-testid=checklist-item-input]').type(JSON.stringify($el))
      cy.get('[data-testid=checklist-item-form]').submit()
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[aria-label=checklist-item-checkbox-on-drawer]').each(($el, index) => {
      if (index % 2 === 0) {
        cy.wrap($el).check({ force: true })
      }
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[aria-label=checklist-item-checkbox-on-drawer]').each(($el, index) => {
      if (index % 2 === 0) {
        cy.wrap($el).should('be.checked')
      }
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=checklist-item-unit-on-drawer]').should('have.length', 3)
    cy.get('[data-testid=btn-remove-checklist-item]').each(($el) => {
      cy.wrap($el).click()
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=checklist-item-unit-on-drawer]').should('have.length', 0)
    cy.get('[data-testid=checklist-item-unit-on-drawer]').should('not.exist')
    cy.get('[data-testid=checklist-group-description-on-drawer]').type('Description{enter}')
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=checklist-group-description-on-drawer]').should('have.value', 'Description\n')
    cy.get('[data-testid=btn-remove-checklist-group-unit]').click()
  })
})

// Notes: This `export` for fix this error message
// Error message: 'index.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file.
// Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {}
