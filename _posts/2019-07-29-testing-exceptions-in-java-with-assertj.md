---
title: "Testing Exceptions in Java with AssertJ"
date: 2019-07-29
header:
  image: /assets/images/testing-exceptions-in-java-with-assertj/header.jpg
  image_description: "Rift in Antarctica's Larsen C Ice Shelf - Global warming is accelerating and our polar regions are melting at an unsustainable rate. We need to take care of our planet :("
  caption: "NASA/John Sonntag"
category:
 - dev
tags:
 - java
 - testing
 - tdd

---

Quite often at work I'm banging on about code being easy to read. It's a well understood notion that [it's harder to read code than to write it][1] so I'm always keen to keep things as ledgable as possible, especially in my tests which I hope provide backup documentation.

Exceptions haven't always been the easiest things to test properly in Java, and by test I am including the exception message and structure as well as the type, but I recently started using a new feature of [AssertJ][2] which I think helps keep the flow of the tests smooth.

First of all though, here is how I progressed in this area before now...

## JUnit 'expected' annotation parameter

At first, all that I knew about was the '[expected][3]' parameter of JUnit's @Test annotation. This allows you to specify the exception class you expect will be thrown and if that indeed occurs during test execution then the test will pass.

```
@Test(expected = MyException.class)
public void throwsAnExceptionWhenTryingToCalculateWithNull() throws MyException {
    testSubject.calculate(null)
}
```

The above is actually quite clear to read to be honest, but it doesn't allow you to check any of the details of the excpetion itself, only that it was thrown.

## JUnit ExpectedException Rule

My code next migrated to a better JUnit feature which allows you to make some assertions against a captured exception. Being able to check the message and other properties of the object was a massive gain, you just have to add a small bit of plubming with the [@Rule][4].

```
@Rule
public ExpectedException thrown = ExpectedException.none();

@Test
public void throwsAnExceptionWhenTryingToCalculateWithNull() {

    thrown.expect(MyException.class);
    thrown.expectMessage(startsWith("Calculating for null makes no sense here"));
    thrown.expect(hasProperty("response", hasProperty("status", is(400))));

    testSubject.calculate(null)
}
```

Now that's what I'm talking about. I can test it all and it's fairly clear to read. It does however gripe me that the 'Given, When, Then' pattern I try to follow is broken, now being 'Given, Then, When'. Personally I find that doesn't flow in a natural way and thus is harder to read. Maybe a better solution can be sought?

## AssertJ Exception Assertion

Of course it can...

AssertJ added a new [exception assertion][5] that allows us to test the exception and its message and properties as before but also in a BDD style 'Given, When, Then' pattern. We can also get rid of the plumbing too which is nice, **I find it very distracting to have to scroll up to the top of the class to reference class members** (or even worse for private members being used to prevent 'magic-numbers').

```
@Test
public void throwsAnExceptionWhenTryingToCalculateWithNull() {

    // when
    Throwable thrown = catchThrowable(() -> testSubject.calculate(null));

    // then
    assertThat(thrown)
        .isInstanceOf(MyException.class)
        .hasMessageContaining("Calculating for null makes no sense here")
        .hasFieldOrPropertyWithValue("status", "400")
        .hasCause(InvalidArgumentException.class);
}
```

So there we have it, fully testable exceptions but also the easiest to read in a natural flow (in my opinion).


[1]: https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/
[2]: https://joel-costigliola.github.io/assertj/
[3]: https://junit.org/junit4/javadoc/4.12/org/junit/Test.html#expected()
[4]: https://github.com/junit-team/junit4/wiki/rules#expectedexception-rules
[5]: https://joel-costigliola.github.io/assertj/assertj-core-features-highlight.html#exception-assertion

