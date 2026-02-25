import { Helmet } from 'react-helmet-async'
import { useData } from '../context/DataContext'

const SEO = ({ 
  title, 
  description, 
  keywords,
  image,
  url,
  type = 'website'
}) => {
  const { data } = useData()
  const siteInfo = data.siteInfo

  const defaultTitle = `${siteInfo.name} - Psi Fryzjer Nowe Miasto Lubawskie i Iława | Salon Groomerski`
  const defaultDescription = `${siteInfo.name} – profesjonalny psi fryzjer i salon groomerski w Nowym Mieście Lubawskim i Iławie. Strzyżenie psów, kąpiel, pielęgnacja sierści, obcinanie pazurków. Umów wizytę: ${siteInfo.phone}`
  const defaultKeywords = 'psi fryzjer, psi fryzjer nowe miasto lubawskie, psi fryzjer iława, groomer, groomer nowe miasto lubawskie, groomer iława, salon groomerski, strzyżenie psów, kąpiel psów, pielęgnacja psów, fryzjer dla psów, Clean Dog, Daria Wiśniewska, salon dla psów warmińsko-mazurskie'
  const defaultImage = siteInfo.logo || siteInfo.banner
  const defaultUrl = 'https://cleandog.pl'

  const seoTitle = title || defaultTitle
  const seoDescription = description || defaultDescription
  const seoKeywords = keywords || defaultKeywords
  const seoImage = image || defaultImage
  const seoUrl = url || defaultUrl

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": siteInfo.name,
    "image": seoImage,
    "description": seoDescription,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "ul. Narutowicza 28a",
      "addressLocality": "Nowe Miasto Lubawskie",
      "postalCode": "13-300",
      "addressCountry": "PL"
    },
    "telephone": siteInfo.phone,
    "email": siteInfo.email,
    "url": seoUrl,
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ],
    "sameAs": [
      siteInfo.facebook,
      siteInfo.instagram
    ].filter(Boolean)
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={siteInfo.owner} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content={siteInfo.name} />
      <meta property="og:locale" content="pl_PL" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Polish" />
      <meta name="geo.region" content="PL-WN" />
      <meta name="geo.placename" content="Nowe Miasto Lubawskie" />
      <meta name="geo.position" content="53.4219;19.5933" />
      <meta name="ICBM" content="53.4219, 19.5933" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

export default SEO
