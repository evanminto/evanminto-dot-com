---
date: 2019-10-14T00:00:00-7:00

title: Responsive Floats Using the “Switcher Expression”

description: "A way to display HTML elements as blocks in small containers and floats in larger containers."

tags:
  - post
  - published
---

![A floated box with text wrapping around it, and another box laid out as a block, with text underneath it.](/images/blog/responsive-floats.jpg)

Back in the day (...five or ten years ago), if you wanted to put two things next to each other in CSS, you needed to use floats. It was a hack, taking a feature meant for wrapping text around images and abusing it to create multi-column layouts. These days Flexbox and Grid have replaced the handy ol’ float for this purpose, so we can finally float only the things that _should_ be floated.

Still, now that we’ve got these new tools, floats are starting to show their age. Flexbox and Grid have mechanisms for dynamically allocating space based on the container size (Flexbox is all about exactly this, and Grid has `auto-fill`/`auto-fit`), but floats just... float.

What if I want an element to float in some circumstances but _not_ float in others? For example, when the container gets too small and the text is getting pushed out by the floated element, I’d like it to stop floating and just behave like a regular, un-floated block. Previously I would have used a media query to solve this, but doing so couples my float’s state to the _viewport_ size, meaning that I can’t use it in a reusable component. Another option is to set the float’s width to a percentage (say, 50% of the container width), but then we end up with a teensy tiny floated element when the container gets really small.

What we really need is something like the [“Switcher” from Every Layout](https://every-layout.dev/layouts/switcher/): a component that can **switch between floated and un-floated versions based on the container size**. It turns out we can achieve just that by stealing a bit of code from that very same Switcher layout! Without further ado:

```css
.float {
  --breakpoint: 40rem;
  --min-size: 40%;
  --gap: 1.5rem;

  float: left;
  width: calc((var(--breakpoint) - 100%) * 9999);
  min-width: var(--min-size);
  max-width: 100%;
  margin-bottom: var(--gap);
  margin-right: var(--gap);
}
```

{% codepen 'https://codepen.io/vamptvo/pen/MWWKKJz', 'Switcher Float' %}{% endcodepen %}

The element now floats to the left and takes up 40% of the container width. When the container width drops below `40rem`, the floated element takes up 100% of the container width and pushes the surrounding text underneath it.

So how does it work? Let’s break it down line by line.

```css
float: left;
```

Obviously we need to float the element, though notice that there’s no code here to “un-float” it. That’s because it’s going to stay floated regardless of the available space; we’re just going to make it _look_ like it’s set to `float: none;`.

```css
width: calc((var(--breakpoint) - 100%) * 9999);
```

This is the key right here. It’s what I’ll henceforth refer to as the “switcher expression,” the `calc()` expression that enables the Switcher layout. The `var(--breakpoint)` is a [custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/--*), CSS’s new-ish built-in variable feature. The rest of it is a fancy way of comparing that breakpoint value with the current width of the element, returning a huge positive number (if the width is smaller than the breakpoint), a huge negative number (if the width is larger than the breakpoint), or zero (if the widths are the same). For a more in-depth explanation of how it works, I recommend you [purchase the full version of Every Layout](https://every-layout.dev/checkout/)

This line gets us most of the way there, but obviously we don’t want to actually use these huge numbers as-is. In the original Switcher layout, this value is used as the `flex-basis`, and standard Flexbox behavior ensures that very large or small values get clamped. We don’t have that luxury here, so instead we need to use...

```css
min-width: var(--min-size);
```

When the value of the switcher expression results in a non-positive number, we want to clamp the value to some sensible minimum, in this case 40% of the container size. `min-width` is perfect for the job. This value _must_ be a percentage, at least in most browsers (more on that in a bit), since a fixed length value would mean that the floated element would overflow its container when the container width is smaller than the minimum.

```css
max-width: 100%;
```

Now we handle the other side. When the switcher expression results in a huge positive number, we clamp it down to 100% of the container size. When the element fills its width, there’s no more space for text to wrap around it, so the text starts directly below it, as if it weren’t floated at all.

```css
margin-bottom: var(--gap);
margin-right: var(--gap);
```

Finally, we add margins on the bottom and right side of the element, ensuring a readable gutter for text to flow around. You might be worried about putting a gutter on the right side when the element gets set to 100% width, but because it’s floated and sits outside of regular flow, this margin has no effect. Perfect!

## Caveat: `min-width` Must Be a Percentage

The biggest caveat is that `min-width` has to be a percentage length. This can be slightly alleviated by using the `calc()` expression I showcased in my post about [intrinsically responsive CSS Grids](https://evanminto.com/blog/intrinsically-responsive-css-grid-minmax-min/): `calc(10% + 5rem)`. This expression changes its value based on the container, but the container size has less influence than it would have on a pure percentage value. It does still have a fixed minimum size (meaning there’s a risk of overflow), but it’s much smaller than it would be if we just set a fixed minimum. Still, this approach is pretty finnicky. It can be hard to pick the right values to get a size you want.

Thankfully, as I mentioned in the Grid post, Safari supports some new functions that can help us here.

```css
--min-size: 20rem;
--switcher-width: calc((var(--breakpoint) - 100%) * 9999);

width: max(
  min(
    var(--min-size),
    100%
  ),
  min(
    var(--switcher-width),
    100%
  )
);
```
{% codepen 'https://codepen.io/vamptvo/pen/ZEEQQJP', 'Switcher Float with min()' %}{% endcodepen %}

Using the `min()` and `max()` functions, we can clamp the switcher value _and_ prevent overflow in small containers. The `min()` functions prevent either the `--min-size` or the `--switcher-width` from exceeding the width of the container, ensuring that they are safe to use without any overflow. Then the `max()` function selects the larger of the two values to use as the final computed width.

Safari is the only browser that supports `min()` and `max()` right now (no support for `clamp()` just yet), but Chrome is working on adding support.

{% attentionbox %}
  **Warning:** I was tempted to use `min()` inside the `min-width` declaration, but doing so coupled with a custom property reference causes a crash in Safari when opening the Web Inspector. Careful!
{% endattentionbox %}

## Caveat: Ignores Intrinsic Width of Floated Element

If the element is an image, it will always take up 40% or 100% of the container width, regardless of its intrinsic dimensions. This can pose some problems for small images in large containers, but as long as you’re using sensible image dimensions this shouldn’t cause any big issues. And if you’re floating container elements like `<div>`s, there’s nothing at all to worry about.

## Caveat: CSS Shapes Can Cause Unexpected Floating

Certain CSS Shapes will cause text to wrap even in the small-container case, since carving out the custom shape makes enough space for the words to start filling in the gaps. This may actually be desirable in specific cases, but it’s definitely something to keep in mind.

## Use Cases

I recommend this for almost any situation that calls for a regular float: images, figures, sidebars, you name it. Floating the element using the switcher expression makes your component much more portable, and makes it possible to build complex nested floats, such as this floated sidebar with a floated image inside it (resize your window to see it in action):

{% codepen 'https://codepen.io/vamptvo/pen/JjjGYJe', 'Nested Floats' %}
```html
<article>
  <h1>Float On</h1>

  <p>
    I backed my car into a cop car the other day<br>
    Well, he just drove off, sometimes life's okay<br>
    I ran my mouth off a bit too much, oh, what did I say?<br>
    Well, you just laughed it off, it was all okay<br>
  </p>

  <p>
    And we'll all float on, okay<br>
    And we'll all float on, okay<br>
    And we'll all float on, okay<br>
    And we'll all float on anyway, well<br>
  </p>

  <aside class="sidebar float">
    <img src="//placehold.it/1200x1200" class="float">

    <h2>Modest Mouse</h2>
    <p>
      Modest Mouse is an American rock band formed in 1992 in Issaquah, Washington and currently based in Portland, Oregon. The founding members are lead singer/guitarist Isaac Brock, drummer Jeremiah Green, and bassist Eric Judy. Strongly influenced by Pavement, Pixies, XTC, and Talking Heads, the band rehearsed, rearranged, and recorded demos for almost two years before finally signing with small-town indie label K Records and releasing numerous singles.
    </p>
  </aside>

  <p>
    A fake Jamaican took every last dime with that scam<br>
    It was worth it just to learn from sleight-of-hand<br>
    Bad news comes, don't you worry even when it lands<br>
    Good news will work it's way to all them plans<br>
    We both got fired on exactly the same day<br>
    Well, we'll float on, good news is on the way<br>
  </p>

  <p>
    And we'll all float on, okay<br>
    And we'll all float on, okay<br>
    And we'll all float on, okay<br>
    And we'll all float on, alright<br>
  </p>

  <p>
    Already we'll all float on<br>
    Now don't you worry, we'll all float on<br>
    Alright, already we'll all float on<br>
    Alright, don't worry, we'll all float on<br>
  </p>

  <p>
    Alright, already and we'll all float on<br>
    Alright, already we'll all float on<br>
    Alright, don't worry even if things end up a bit too heavy<br>
    We'll all float on, alright<br>
  </p>

  <p>
    Already we'll all float on<br>
    Alright, already we'll all float on<br>
    Okay, don't worry, we'll all float on<br>
    Even if things get heavy, we'll all float on<br>
    Alright, already we'll all float on<br>
    Alright, no don't you worry, we'll all float on<br>
    Alright, all float on<br>
  </p>
</article>
```

```css
* {
  box-sizing: border-box;
  margin-bottom: 0;
  margin-top: 0;
}

/* Default vertical rhythm */
* + * {
  margin-top: 1.5rem;
}

br {
  margin: 0;
}

.float {
  --direction: left;
  --breakpoint: 40rem;
  --min-size: 33.333%;
  --gap: 1.5rem;

  /* 1 for right margin, 0 for left margin */
  --use-right-margin: 1;

  float: var(--direction);
  width: calc((var(--breakpoint) - 100%) * 9999);
  min-width: var(--min-size);
  max-width: 100%;
  margin-right: calc(var(--use-right-margin) * var(--gap));
  margin-left: calc((1 - var(--use-right-margin)) * var(--gap));
  margin-bottom: var(--gap);
}

/* Remove default top margin since the floated element is removed from flow. */
.float + * {
  margin-top: 0;
}

.sidebar {
  --direction: right;
  --use-right-margin: 0;

  background: tan;
  padding: 1.5rem;
}

.sidebar .float {
  --breakpoint: 25rem;
}
```
{% endcodepen %}

Or we can build an even more expressive collection of custom properties to allow consumers of this component to fine-tune the sizing of both the float and the text next to it. In this version, the `--breakpoint` isn’t a fixed value; it’s computed by adding together the minimum size of the float, the gap, and the `--min-measure`, a length using `ch` units (each is equal to the width of the `0` character in the current font). Now we don’t have to express the breakpoint as a fixed number. We can express it based on the minimum number of characters we want to see in the right-hand column before breaking to the stacked version of the layout.

{% codepen 'https://codepen.io/vamptvo/pen/eYYJRVV', 'Switcher Float with min() and --min-measure' %}
```css
.float {
  /* Add up the components that make up the total width: target float size, gap, and target measure. */
  --breakpoint: calc(
    var(--min-size) +
    var(--gap) +
    var(--min-measure)
  );

  /* Minimum number of characters to show in a line of text next to the float before making the float fill the container. */
  --min-measure: 30ch;

  /* Minimum size of the float when it's actually floating. Set the fallback version to customize percentage behavior and set the advanced one to customize fixed width behavior. */
  --min-size: var(--min-size-fallback);
  --min-size-fallback: 33.333%;
  --min-size-advanced: 20rem;

  /* Gap between the float and its surrounding elements. */
  --gap: 1.5rem;

  /* Width of the float will change based on container size. */
  --switcher-width: calc((var(--breakpoint) - 100%) * 9999);

  float: left;
  width: var(--switcher-width);
  min-width: var(--min-size);
  max-width: 100%;
  margin-right: var(--gap);
  margin-bottom: var(--gap);
}

@supports (width: max(1rem, min(calc(2rem + 3rem), 4rem))) {
  .float {
    /* Set the minimum size to the advanced version, since it's supported. */
    --min-size: var(--min-size-advanced);

    width: max(
      min(
        var(--min-size),
        100%
      ),
      min(
        var(--switcher-width),
        100%
      )
    );

    /* Remove these constraints, since the max() and min() expression above handles them already. */
    min-width: 0;
    max-width: none;
  }
}
```
{% endcodepen %}

And there you have it! Floats that respond to the container size. Another old-school CSS layout that we can transform into a modern, intrinsically responsive version.
