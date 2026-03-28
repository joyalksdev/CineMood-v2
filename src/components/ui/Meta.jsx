import { Helmet } from 'react-helmet-async';

const Meta = ({ title }) => {
  const siteName = "CineMood";
  
  // If no title is passed, it falls back to the default
  const fullTitle = title ? `${siteName} • ${title}` : `${siteName} • Neural Discovery`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};

export default Meta;

