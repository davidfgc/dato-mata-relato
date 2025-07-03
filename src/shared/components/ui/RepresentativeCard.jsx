import React from 'react';
import PropTypes from 'prop-types';

const RepresentativeCard = ({ representative, vote, showParty = false, partyName }) => {
  // Colores personalizados según el diseño original
  const colors = {
    favorable: '#6DD68D', //#2E8540',
    opposed: '#FF7A7A', //#CD2026',
    absent: '#B0B0B0', //#5B616B',
    primaryText: '#FFFFFF', //#212121',
    secondaryText: '#757575', //#757575',
    cardBackground: '#2C2C2C', //#FFFFFF',
    interactive: '#757575', //#007bff',
  };

  // Configuración del voto según el estado
  const getVoteConfig = (voteType) => {
    switch (voteType) {
      case 'yes':
        return {
          icon: '✓',
          text: 'A Favor',
          color: colors.favorable,
        };
      case 'no':
        return {
          icon: '✗',
          text: 'En Contra',
          color: colors.opposed,
        };
      case 'absent':
        return {
          icon: '-',
          text: 'Ausente',
          color: colors.absent,
        };
      default:
        return {
          icon: '-',
          text: 'Sin Datos',
          color: colors.absent,
        };
    }
  };

  const voteConfig = getVoteConfig(vote);

  const cardStyles = {
    backgroundColor: colors.cardBackground,
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05), 0 4px 8px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease-out',
    cursor: 'default',
    border: 'none',
    outline: 'none',
    textAlign: 'left',
  };

  const hoverStyles = {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15), 0 16px 32px rgba(0,0,0,0.15)',
    backgroundColor: '#3C3C3C', // Un poco más claro para que sea más visible
  };

  const nameStyles = {
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '24px',
    color: colors.primaryText,
    marginBottom: '8px',
    margin: '0 0 8px 0',
  };

  const statusContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const voteDetailStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const voteIconStyles = {
    fontWeight: 700,
    fontSize: '16px',
    color: voteConfig.color,
  };

  const voteTextStyles = {
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '20px',
    color: voteConfig.color,
  };

  const partyStyles = {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '16px',
    color: colors.secondaryText,
    padding: '4px 8px',
    border: `1px solid ${colors.secondaryText}`,
    borderRadius: '16px',
    backgroundColor: 'transparent',
  };

  const avatarStyles = {
    width: '72px', // Aumenta el tamaño del avatar
    height: '72px',
    borderRadius: '50%',
    backgroundColor: colors.secondaryText,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '28px', // Aumenta el tamaño de las iniciales
    color: '#fff',
    marginRight: '24px', // Un poco más de espacio
    flexShrink: 0,
    userSelect: 'none',
  };

  const [isHovered, setIsHovered] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const finalStyles = {
    ...cardStyles,
    ...(isHovered ? hoverStyles : {}),
  };

  // Debug: para verificar que el hover funciona
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div style={finalStyles} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        {/* Avatar */}
        <div style={avatarStyles}>
          {representative.thumbnail && !imgError ? (
            <img
              src={representative.thumbnail}
              alt={representative.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          ) : (
            // Iniciales del nombre
            representative.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
          )}
        </div>
        {/* Nombre del representante */}
        <h3 style={nameStyles}>{representative.name}</h3>
      </div>

      {/* Estado del voto y partido */}
      <div style={statusContainerStyles}>
        {/* Detalle del voto */}
        <div style={voteDetailStyles}>
          <span style={voteIconStyles}>{voteConfig.icon}</span>
          <span style={voteTextStyles}>{voteConfig.text}</span>
        </div>

        {/* Partido político */}
        {showParty && <span style={partyStyles}>{partyName || representative.party_name || 'Sin Partido'}</span>}
      </div>
    </div>
  );
};

RepresentativeCard.propTypes = {
  representative: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    party_name: PropTypes.string,
  }).isRequired,
  vote: PropTypes.string.isRequired,
  showParty: PropTypes.bool,
  partyName: PropTypes.string,
};

export default RepresentativeCard;
