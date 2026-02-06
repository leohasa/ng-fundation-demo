-- =============================================
-- DATABASE: FOUNDATION PROTOTYPE
-- Engine: PostgreSQL 17
-- =============================================

-- 1. USERS (Simple admin login)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password, name)
VALUES ('admin@fundacion.org', 'admin123', 'Administrador');

-- 2. PROJECTS (Blog-style entries)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(500),
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    publish_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SETTINGS (Mission, Vision, Values, Impact stats)
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) UNIQUE NOT NULL,
    value TEXT,
    description VARCHAR(200)
);

INSERT INTO settings (key, value, description) VALUES
('mission', 'Transformar vidas a través de programas de educación, salud y desarrollo comunitario sostenible.', 'Misión de la fundación'),
('vision', 'Ser un referente de cambio social en Guatemala, construyendo comunidades más fuertes y resilientes.', 'Visión de la fundación'),
('values', 'Compromiso, Transparencia, Solidaridad, Respeto, Integridad', 'Valores de la fundación'),
('people_helped', '5000', 'Personas beneficiadas'),
('projects_completed', '50', 'Proyectos completados'),
('communities_supported', '25', 'Comunidades apoyadas'),
('years_of_experience', '10', 'Años de experiencia'),
('address', 'Ciudad de Guatemala, Guatemala', 'Dirección física'),
('phone', '+502 1234-5678', 'Teléfono de contacto'),
('contact_email', 'info@fundacion.org', 'Correo de contacto');

-- 4. SOCIAL_NETWORKS
CREATE TABLE social_networks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    url VARCHAR(300) NOT NULL,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO social_networks (name, url, icon) VALUES
('Facebook', 'https://facebook.com/fundacion', 'facebook'),
('Instagram', 'https://instagram.com/fundacion', 'instagram'),
('Twitter', 'https://twitter.com/fundacion', 'twitter');

-- 5. CONTACT_MESSAGES (Contact form submissions)
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SUPPORT_INFO (Bank accounts and donation methods)
CREATE TABLE support_info (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('bank_account', 'other')),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO support_info (type, title, description) VALUES
('bank_account', 'Banco Industrial', 'Cuenta: 123-456789-0 | A nombre de: Fundación XYZ | Tipo: Monetaria'),
('bank_account', 'Banrural', 'Cuenta: 987-654321-0 | A nombre de: Fundación XYZ | Tipo: Ahorro'),
('other', 'Voluntariado', 'Únete como voluntario en nuestros proyectos y marca la diferencia en tu comunidad'),
('other', 'Donación en especie', 'Recibimos alimentos, ropa, útiles escolares y materiales de construcción');

-- =============================================
-- FUNCTION: Auto-update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
