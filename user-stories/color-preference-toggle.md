# User Stories - color color scheme Toggle

Feature: Initial site load with initial color scheme preference
    Background (all):
        Given the user loads the site for the first time
        And has no localStorage key value for color scheme preference

    Background:
        Given the user's system supports light, dark, auto color schemes
        And the user's system is set to Auto

    Scenario: System supports light, dark, auto color schemes - Light appearance
        Given the user's system appearance is Light
        When the user loads the site
        Then the color scheme toggle UI has options for Light, Dark, and Auto
        And is set to Auto
        And the page displays Light colors

    Scenario: System supports light, dark, auto color schemes - Dark appearance
        Given the user's system appearance is Dark
        When the user loads the site
        Then the color scheme toggle UI has options for Light, Dark, and Auto
        And is set to Auto
        And the page displays Dark colors

    Background:
        Given the user's system does NOT support auto color scheme
        And the user's system is set to Dark

    Scenario: System does NOT support auto color scheme
        Given the appearance is Dark
        When the user loads the site
        Then the color scheme toggle UI has options for Light and Dark
        And is set to Dark
        And the page displays Dark colors

    Background:
        Given the user's system does NOT support any color scheme

    Scenario: System does NOT support any color schemes
        When the user loads the site
        Then the color scheme toggle UI has options for Light and Dark
        And is set to Light
        And the page displays Light colors


Feature: Listen for System preference changes
    Background:
      Given the System preference is set to Auto
      And the System appearance is Light

    Scenario: System changes to Dark (manually by user or automatically by the system)
      Given the color scheme toggle UI is Auto
      When the System preference is changed to Dark
      Then the site color scheme toggle UI should remain Auto
      And the site appearance should automatically update to Dark

    Scenario: System changes to Light (manually by user or automatically by the system)
      Given the color scheme toggle UI is Auto
      When the System preference is changed to Light
      Then the site color scheme toggle UI should remain Auto
      And the site appearance should remain Light


Feature: Color scheme preference persists across concurrent sessions
    Background:
        Given a user has two windows or tabs of the site open

    Given the color scheme toggle UI is Dark
    When the user changes the color scheme toggle UI to Light in one session
    Then the other session should automatically update to Light
    And without the user needing to refresh the page

Feature: Color scheme preference persists across new sessions
    Background:
        Given the color scheme toggle UI is Dark

    Scenario: User opens new window or tab
        Given the user opens a new window or tab
        When they load the site
        Then the color scheme toggle UI is set to Dark
        And the site appearance is Dark

    Scenario: User quits the browser and reopens the session
        Given the user reopens the browser
        When the previous session is opened
        Then the color scheme toggle UI is set to Dark
        And the site appearance is Dark

    Scenario: User quits the browser and starts a new session
        Given the user reopens the browser
        And loads a new window or tab
        When the page loads
        Then the color scheme toggle UI is set to Dark
        And the site appearance is Dark


Feature: Manual manipulation of `localStorage` color preference value
    Likely done by the user via Web Inspector

    Scenario: Previous key is valid
        Given an invalid localStorage value is entered (e.g., Red)
        And the old value is valid (e.g., Dark)
        When the invalid value is submitted
        Then the previous value (Dark), should be set/used

    Scenario: Previous key is empty or invalid
        Given an invalid localStorage value is entered (e.g., Red)
        And the old value is empty or invalid
        When the invalid value is submitted
        Then the value/color preference UI toggle/appearance should be set to Auto

    Scenario: User manually enters valid value
        Given a valid localStorage value is entered (e.g., Light)
        When the value is submitted
        Then that value (Light) should be set/used


Feature: Proper color scheme with Safari's strict caching
    Background:
        Given a user is on the homepage
        And the color scheme toggle UI is Dark

    Given the user goes to a new page
    And sets the color scheme toggle UI to Light
    When the user selects the browser back button to go to the previous page (i.e., the homepage)
    Then the homepage should display Light colors
    And the color scheme toggle UI should be set to Light


Feature: Color scheme toggle works on page when Cookies are disabled
    Given the user has cookies disabled
    When the user loads the page
    Then the toggle should still work as expected on that page
    But the setting will not be able to persist across pages or sessions
