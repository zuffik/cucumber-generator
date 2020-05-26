Feature: Login user
  Successful and unsuccessful login

  Scenario Outline: Successful login
    When inputting <username>
    And inputting <password>
    And trying to login
    Then it should be successful
    Examples:
      | username | password                 |
      | demo-1   | {env.APP_DEMO_USER_PASS} |
      | demo-2   | {env.APP_DEMO_USER_PASS} |



  Scenario: Unsuccessful login
    When inputting credentials
      | username | password                              |
      | demo-1   | something-that'll probably won't work |
      | demo-2   | An0therDummyPAss                      |
    And trying to login
    Then it shouldn't be successful


