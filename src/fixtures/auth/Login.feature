Feature: Login user
  Successful and unsuccessful login

  Scenario: Successful login
    When inputting credentials
      | username | password                 |
      | demo-1   | {env.APP_DEMO_USER_PASS} |
      | demo-2   | {env.APP_DEMO_USER_PASS} |
    And trying to login
    Then it should be successful



  Scenario: Unsuccessful login
    When inputting credentials
      | username | password                              |
      | demo-1   | something-that'll probably won't work |
      | demo-2   | An0therDummyPAss                      |
    And trying to login
    Then it shouldn't be successful


