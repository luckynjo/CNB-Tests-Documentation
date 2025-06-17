import React, { useState } from 'react';

// Navbar component
const NavbarLeft = () => {
  // Define the navigation items
  const navItems = [
    "[TASK] adt : Age Differentiation Task",
    "[TASK] cpf : Penn Facial Memory Test",
    "[FORM] cpf : Penn Facial Memory Test (Version 1)",
    "[FORM] cpf : Penn Facial Memory Test (Version 2)",
    "[TASK] cpf2 : Penn Facial Memory Test - v2",
    "[FORM] cpf2 : Penn Facial Facial Memory Test - v2 (Version 1)",
    "[FORM] cpf2 : Penn Facial Memory Test - v2 (Version 2)",
    "[TASK] cpw : Penn Word Memory Test",
    "[FORM] cpw : Penn Word Memory Test (Version 1)",
    "[FORM] cpw : Penn Word Memory Test (Version 2)",
    "[FORM] cpw : Penn Word Memory Test (Version 3)",
    "[TASK] ddisc : Delay Discounting Task",
    "[TASK] edisc : Effort Discounting Task",
    "[TASK] er40 : Penn Emotion Recognition Test",
    "[TASK] medf : Measured Emotion Differentiation Task",
    "[TASK] plot : Penn Line Orientation Test",
    "[TASK] pmat : Penn Matrix Analysis Test",
    "[TASK] pra : Penn Reading Assessment",
    "[TASK] pvrt : Penn's Logical Reasoning Test",
    "[TASK] rdisc : Risk Discounting Task",
    "[TASK] volt : Visual Object Learning Test",
    "[FORM] volt : Visual Object Learning Test (Version 1)",
    "[FORM] volt : Visual Object Learning Test (Version 2)",
  ];

  // State to manage which item is currently hovered
  const [hoveredItem, setHoveredItem] = useState(null);

  // Define the base style for the dark background navbar container
  const navbarContainerStyle = {
    background: '#1A2B4C', // Dark blue BG
    // background: '#455a63',
    // borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(59, 15, 15, 0.2)', // Subtle shadow for depth
    // border: '1px solid rgba(255, 255, 255, 0.05)', // Very subtle light border
  };

  // Style for individual nav items
  const navItemStyle = {
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth transition for hover
    borderRadius: '8px', // Slightly smaller border-radius for items
    color: '#E0E0E0', // Light grey text for contrast on dark background
    fontSize: '100%',
    textAlign: 'left',
    backgroundColor: 'transparent', // No background by default
  };

  // Hover style for individual nav items
  const navItemHoverStyle = {
    backgroundColor: '#E0E0E0', // Light grey background on hover
    color: '#1A2B4C', // Dark blue text on hover
  };

  return (
    <div id="nav-wrapper" style={{
      ...navbarContainerStyle,
      width: '250px',
      height: 'calc(75vh)',
      position: 'fixed',
      padding: '40px 20px',
      overflowY: 'hidden', // Allows scrolling if content overflows
      borderRadius: '0px 50px 50px 0px'

    }}>
      <div id="nav-container" style={{
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflowY: 'auto', // Allows scrolling if content overflows
        fontFamily: 'Inter, sans-serif', // Ensure Inter font is used
        height: "100%",
        gap: "10px"
      }}>
        <h2 style={{
          color: '#FFFFFF', // White color for the heading
          fontSize: '120%',
          textAlign: 'center',
          textShadow: '0 1px 3px rgba(0,0,0,0.3)', // Slightly stronger text shadow
          textDecoration: "underline",
          margin: "10px 0",
          padding: 0
        }}>Task Selection</h2>
        <nav style={{ flexGrow: 1, width: "100%", background: "none"}}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item, index) => (
              <li
                key={index}
                style={{
                  ...navItemStyle,
                  ...(hoveredItem === index ? navItemHoverStyle : {}),
                  marginBottom: '8px', // Spacing between items
                  textWrap: "balance" // Helps with multi-line text wrapping
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => console.log(`Clicked: ${item}`)} // Example click handler
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NavbarLeft;
