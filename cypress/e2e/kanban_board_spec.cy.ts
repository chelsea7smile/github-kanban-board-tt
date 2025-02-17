/// <reference types="cypress" />
/// <reference path="../support/commands.d.ts" />

describe('GitHub Kanban Board', () => {
  const repoUrl = 'https://github.com/facebook/react';
  const apiUrl = 'https://api.github.com/repos/facebook/react/issues';

  const mockIssues = [
    {
      id: 1,
      title: 'Issue 1',
      number: 1,
      user: { login: 'user1', avatar_url: 'https://example.com/avatar1.png' },
      url: 'https://github.com/example/repo/issues/1',
      html_url: 'https://github.com/example/repo/issues/1',
      assignee: null,
      state: 'open',
    },
    {
      id: 2,
      title: 'Issue 2',
      number: 2,
      user: { login: 'user2', avatar_url: 'https://example.com/avatar2.png' },
      url: 'https://github.com/example/repo/issues/2',
      html_url: 'https://github.com/example/repo/issues/2',
      assignee: { login: 'user2' },
      state: 'open',
    },
    {
      id: 3,
      title: 'Issue 3',
      number: 3,
      user: { login: 'user3', avatar_url: 'https://example.com/avatar3.png' },
      url: 'https://github.com/example/repo/issues/3',
      html_url: 'https://github.com/example/repo/issues/3',
      assignee: null,
      state: 'closed',
    },
  ];

  beforeEach(() => {
    // Clear localStorage and visit the homepage
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('displays the input and buttons', () => {
    cy.get('[data-cy="repo-url-input"]').should('be.visible');
    cy.get('[data-cy="load-issues-btn"]').should('be.visible');
  });

  it('loads and displays issues correctly', () => {
    // Intercept the API request
    cy.intercept('GET', apiUrl, {
      statusCode: 200,
      body: mockIssues,
    }).as('getIssues');

    // Type the repo URL and click "Load Issues"
    cy.get('[data-cy="repo-url-input"]').type(repoUrl);
    cy.get('[data-cy="load-issues-btn"]').click();

    // Wait for the API request to complete
    cy.wait('@getIssues');

    // Check that the column headings are visible (they are rendered within the Column component)
    cy.get('[data-cy="column-todo"]').should('be.visible');
    cy.get('[data-cy="column-inProgress"]').should('be.visible');
    cy.get('[data-cy="column-done"]').should('be.visible');


    // Verify that issues are distributed correctly between columns:
    // For ToDo: open issues without an assignee
    cy.get('[data-cy="column-todo"]').within(() => {
      cy.get('[data-cy="issue-1"]').should('contain.text', '#1 Issue 1');
    });
    // For In Progress: open issues with an assignee
    cy.get('[data-cy="column-inProgress"]').within(() => {
      cy.get('[data-cy="issue-2"]').should('contain.text', '#2 Issue 2');
    });
    // For Done: closed issues
    cy.get('[data-cy="column-done"]').within(() => {
      cy.get('[data-cy="issue-3"]').should('contain.text', '#3 Issue 3');
    });
  });

  it('displays a dropdown instead of columns on mobile view', () => {
    // Set mobile viewport
    cy.viewport(500, 800);
    cy.visit('/');

    // Verify that the Ant Design Select component is visible
    cy.get('.ant-select').should('be.visible');

    // By default, the "ToDo" column should be displayed
    cy.contains('ToDo').should('be.visible');
  });

  it('opens a new tab when clicking on an issue', () => {
    cy.intercept('GET', apiUrl, {
      statusCode: 200,
      body: mockIssues,
    }).as('getIssues');

    // Load issues
    cy.get('[data-cy="repo-url-input"]').type(repoUrl);
    cy.get('[data-cy="load-issues-btn"]').click();
    cy.wait('@getIssues');

    // Stub window.open to verify its call
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    // Find the issue card for "Issue 1" and click on it
    cy.get('[data-cy="issue-link-1"]').click();
    cy.get('@windowOpen').should('be.calledWith', 'https://github.com/example/repo/issues/1', '_blank');
});

  it.skip('drags an issue from one column to another', () => {
    // Intercept the API request
    cy.intercept('GET', apiUrl, {
      statusCode: 200,
      body: mockIssues,
    }).as('getIssues');
  
    // Load issues
    cy.get('[data-cy="repo-url-input"]').type(repoUrl);
    cy.get('[data-cy="load-issues-btn"]').click();
    cy.wait('@getIssues');
  
    // Find the "Issue 1" card in the ToDo column
    cy.get('[data-cy="column-todo"]').within(() => {
      cy.get('[data-cy="issue-1"]').as('dragItem');
    });
    // Find the In Progress column
    cy.get('[data-cy="column-inProgress"]').as('targetColumn');
  
    // Use the drag command with options
    cy.get('@dragItem').drag('@targetColumn', { force: true });
  
    // Optionally, wait a little for the animation to finish
    cy.wait(500);
  
    // Verify that the issue has been moved to the In Progress column
    cy.get('@targetColumn').within(() => {
      cy.get('[data-cy="issue-1"]').should('exist');
    });
  });
});