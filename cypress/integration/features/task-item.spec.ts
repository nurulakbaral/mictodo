describe('Checklist Item', () => {
  const waitTimeBeforeAssert: number = 2000
  beforeEach(() => {
    cy.window().then((window) => {
      window.localStorage.setItem(Cypress.env('localStorageKey'), Cypress.env('localStorageValue'))
      cy.visit('http://localhost:3000/dashboard')
      cy.viewport(1280, 1000)
    })
  })
  afterEach(() => {
    // Notes: .pause() is used to wait for the animation to finish (check your testis right)
    // cy.pause()
  })
  it('Should exits user data on .env file for fake login', () => {
    expect(Cypress.env('localStorageKey')).to.equal('supabase.auth.token')
    expect(Cypress.env('localStorageValue')).to.not.equal('')
  })
  it.skip('Should show dashboard page', () => {
    cy.contains('Hallo')
    cy.get('[data-testid=text-field-add-task-wrapper').should('be.visible')
  })
  it('Should create one checklist group', () => {
    cy.get('[data-testid=text-field-add-task-wrapper]').should('be.visible')
    cy.get('[data-testid=text-field-add-task]').type('Workout!{enter}')
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-group]').should('be.visible')
    cy.get('[data-testid=task-group]').should('have.length', 1)
  })
  it('Should create, remove, and checked multiple checklist item', () => {
    cy.get('[data-testid=task-group]').should('be.visible')
    cy.get('[data-testid=task-group]').should('have.length', 1)
    cy.get('[data-testid=task-group]').click()
    cy.get('[data-testid=text-field-add-task-item-wrapper').should('be.visible')
    cy.wrap(['Sit-up', 'Push-up', 'Pull-up']).each(($el) => {
      cy.get('[data-testid=text-field-add-task-item]').type(`${JSON.stringify($el)}{enter}`)
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[aria-label=task-item-checkbox-on-drawer]').each(($el, index) => {
      if (index % 2 === 0) {
        cy.wrap($el).check({ force: true })
      }
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[aria-label=task-item-checkbox-on-drawer]').each(($el, index) => {
      if (index % 2 === 0) {
        cy.wrap($el).should('be.checked')
      }
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-item-on-drawer-wrapper]').should('have.length', 3)
    cy.get('[data-testid=button-delete-task-item]').each(($el) => {
      cy.wrap($el).click()
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-item-on-drawer-wrapper]').should('have.length', 0)
    cy.get('[data-testid=task-item-on-drawer-wrapper]').should('not.exist')
    cy.get('[data-testid=task-group-description-on-drawer]').type('Hello Mictodo')
    cy.get('[data-testid=task-group-description-on-drawer]').blur()
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-group-description-on-drawer]').should('have.value', 'Hello Mictodo')
    cy.get('[data-testid=button-delete-task-group]').click()
  })
})

// Notes: This `export` for fix this error message
// Error message: 'index.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file.
// Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {}
