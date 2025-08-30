import React from "react";

const SectionTitle = ({
  title,
  subtitle,
  count,
  tone = "primary",
  icon = "🚌",
}) => {
  return (
    <>
      <div className={`section-title section-title--${tone}`}>
        <div className="section-title__left">
          <div className="section-title__icon" aria-hidden>
            <span role="img" aria-label="icon">
              {icon}
            </span>
          </div>
          <div>
            <div className="section-title__title">{title}</div>
            {subtitle ? (
              <div className="section-title__subtitle">{subtitle}</div>
            ) : null}
          </div>
        </div>
        {typeof count === "number" ? (
          <span className="section-title__badge">{count}</span>
        ) : null}
      </div>
      <div className={`section-divider section-divider--${tone}`} />
    </>
  );
};

export default SectionTitle;
