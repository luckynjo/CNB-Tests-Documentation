import React from 'react';

export const AdminLayout = props => {
  const {menu, section, ...rest} = props;
  return (
    <>
<header>
  <h1>Webcnp Test Admin.</h1>
</header>

<nav>
  <ul>
  {menu}
  </ul>
</nav>

<main>
  <section id="section-1">
  {section}
  </section>
</main>

<footer>
  &copy;2022 University of Pennsylvania.
</footer>
    </>
  )
}
