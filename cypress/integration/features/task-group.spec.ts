describe('Checklist Group', () => {
  const waitTimeBeforeAssert: number = 2000
  beforeEach(() => {
    cy.then(async () => {
      window.localStorage.setItem(Cypress.env('localStorageKey'), Cypress.env('localStorageValue'))
      cy.visit('http://localhost:3000/dashboard')
    })
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
  it('Should show dashboard page and TextFieldAddTask wrapper', () => {
    cy.contains('Hallo')
    cy.get('[data-testid=text-field-add-task-wrapper').should('be.visible')
  })
  it('Should success create task group', () => {
    cy.get('[data-testid=text-field-add-task-wrapper').should('be.visible')
    cy.get('[data-testid=text-field-add-task]').type('Workout!{enter}')
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-group]').should('be.visible')
    cy.get('[data-testid=task-group]').should('have.length', 1)
  })
  it('Should Success remove task group', () => {
    cy.get('[data-testid=task-group]').should('be.visible')
    cy.get('[data-testid=task-group]').should('have.length', 1)
    cy.get('[data-testid=task-group]').click()
    cy.get('[data-testid=button-delete-task-group]').click()
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-group]').should('not.exist')
  })
  it('Should success create multiple task group', () => {
    cy.get('[data-testid=text-field-add-task-wrapper').should('be.visible')
    cy.wrap(['React', 'Vue', 'Svelte']).each((el) => {
      cy.get('[data-testid=text-field-add-task]').type(`${JSON.stringify(el)}{enter}`)
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-group]').should('have.length', 3)
  })
  it('Should success task group checked', () => {
    cy.get('[data-testid=task-group]').should('have.length', 3)
    cy.get('[aria-label=task-group-checkbox]').each(($el) => {
      cy.wrap($el).check({ force: true })
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[aria-label=task-group-checkbox]').each(($el) => {
      cy.wrap($el).should('be.checked')
    })
  })
  it('Should success remove multiple task group', () => {
    cy.get('[data-testid=task-group]').should('have.length', 3)
    cy.get('[data-testid=task-group]').each(($el) => {
      cy.wrap($el).click()
      cy.get('[data-testid=button-delete-task-group]').click()
    })
    cy.wait(waitTimeBeforeAssert)
    cy.get('[data-testid=task-group]').should('not.exist')
  })
})

// Notes: This `export` for fix this error message
// Error message: 'index.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file.
// Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)
export {}
