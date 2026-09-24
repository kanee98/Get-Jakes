'use client';

export default function Gallery() {
  const items = [
    { title: "Aurelia 4-Tier Ballroom Display", category: "Wedding Showcase", image: "/images/wedding_tier_prop.png" },
    { title: "Ophelia Cyan & Gold Leaf Statement", category: "Studio Portfolio", image: "/images/hero_cake_prop.png" },
    { title: "Pastel Photography Prop Set", category: "Food Studio Kit", image: "/images/photo_prop_set.png" },
    { title: "Imperial Ribbed Cylinder Risers", category: "Display Pedestal", image: "/images/pedestal_prop_set.png" }
  ];

  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get Jakes In Action</h2>
          <p className="section-subtitle">
            See how master event planners, food stylists, and luxury bakeries showcase Get Jakes prop installations.
          </p>
        </div>

        <div className="gallery-grid">
          {items.map((item, idx) => (
            <div key={idx} className="gallery-card">
              <img src={item.image} alt={item.title} className="gallery-img" />
              <div className="gallery-overlay">
                <span className="gallery-cat">{item.category}</span>
                <h4 className="gallery-title">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
