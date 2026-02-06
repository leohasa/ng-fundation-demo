import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/project.model';
import { SupportInfo, CreateSupportInfoDto, UpdateSupportInfoDto, SupportType } from '../models/support-info.model';
import { Setting, CreateSettingDto, UpdateSettingDto } from '../models/setting.model';

/**
 * MockDataService - Servicio de datos simulados
 * 
 * Proporciona datos de prueba con delays simulados para:
 * - Projects (Proyectos)
 * - SupportInfo (Información de apoyo)
 * - Settings (Configuraciones)
 * 
 * Puede retornar tanto Observables como Signals para mayor flexibilidad
 */
@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Delay por defecto para simular latencia de red (ms)
  private readonly DEFAULT_DELAY = 800;

  // ==========================================
  // DATOS MOCK - PROJECTS
  // ==========================================
  private mockProjects: Project[] = [
    {
      id: '1',
      title: 'Centro Comunitario San Miguel',
      shortDescription: 'Construcción de un espacio de encuentro para la comunidad del barrio San Miguel',
      content: `Este proyecto tiene como objetivo principal la construcción de un centro comunitario en el barrio San Miguel, 
      un espacio que servirá como punto de encuentro para los vecinos y permitirá realizar diversas actividades culturales, 
      educativas y recreativas.

      El centro contará con:
      - Salón multiusos para eventos y reuniones (capacidad 200 personas)
      - Biblioteca comunitaria con más de 3,000 libros
      - Sala de computación con 20 equipos modernos
      - Espacios deportivos al aire libre
      - Cocina comunitaria equipada
      - Áreas verdes y de esparcimiento

      Beneficiarios: Se estima que más de 5,000 familias del barrio podrán hacer uso de estas instalaciones.

      Estado actual: En fase de construcción (70% completado). Se espera inaugurar en junio de 2026.`,
      imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
      publishDate: new Date('2024-01-15'),
      isActive: true
    },
    {
      id: '2',
      title: 'Programa de Becas Educativas 2026',
      shortDescription: 'Apoyo financiero para estudiantes destacados de escasos recursos',
      content: `El Programa de Becas Educativas 2026 busca brindar oportunidades de educación superior a jóvenes talentosos 
      que enfrentan dificultades económicas.

      Alcance del programa:
      - 150 becas completas para estudios universitarios
      - 50 becas para estudios técnicos
      - Cobertura de matrícula, materiales y transporte
      - Apoyo económico mensual para gastos básicos
      - Mentoría académica personalizada

      Requisitos:
      - Promedio académico mínimo de 8.5
      - Demostrar necesidad económica
      - Participación en actividades comunitarias
      - Compromiso de retribución social

      Este programa ha cambiado la vida de más de 500 estudiantes desde su inicio en 2020.`,
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
      publishDate: new Date('2024-02-20'),
      isActive: true
    },
    {
      id: '3',
      title: 'Huertos Urbanos Sostenibles',
      shortDescription: 'Creación de espacios verdes productivos en zonas urbanas',
      content: `Iniciativa de agricultura urbana que transforma espacios abandonados en huertos comunitarios productivos.

      Objetivos principales:
      - Promover la seguridad alimentaria local
      - Generar espacios de convivencia comunitaria
      - Educación ambiental y agricultura sostenible
      - Reducción de la huella de carbono

      Logros hasta la fecha:
      - 12 huertos comunitarios establecidos
      - 300 familias participantes
      - 5 toneladas de alimentos producidos mensualmente
      - Talleres de capacitación para 500+ personas

      Técnicas utilizadas:
      - Compostaje de residuos orgánicos
      - Sistemas de riego por goteo
      - Cultivos sin pesticidas
      - Rotación de cultivos

      Los productos se distribuyen entre las familias participantes y el excedente se dona a comedores comunitarios.`,
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
      publishDate: new Date('2024-03-10'),
      isActive: true
    },
    {
      id: '4',
      title: 'Clínica Móvil de Salud',
      shortDescription: 'Atención médica gratuita en comunidades rurales',
      content: `Proyecto de salud comunitaria que lleva atención médica básica a poblaciones alejadas de centros urbanos.

      Servicios ofrecidos:
      - Consulta médica general
      - Atención odontológica
      - Control de embarazo y pediatría
      - Entrega de medicamentos básicos
      - Campañas de vacunación
      - Talleres de prevención de enfermedades

      Cobertura:
      - 25 comunidades rurales atendidas
      - Visitas quincenales programadas
      - Más de 10,000 consultas anuales
      - Equipo de 15 profesionales de la salud

      Impacto:
      - Reducción del 40% en casos de enfermedades prevenibles
      - Detección temprana de enfermedades crónicas
      - Mejora en indicadores de salud materno-infantil

      La clínica móvil está equipada con tecnología médica moderna y cuenta con alianzas con hospitales regionales 
      para casos que requieren atención especializada.`,
      imageUrl: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&h=600&fit=crop',
      publishDate: new Date('2024-04-05'),
      isActive: true
    },
    {
      id: '5',
      title: 'Programa de Emprendimiento Juvenil',
      shortDescription: 'Capacitación y financiamiento para jóvenes emprendedores',
      content: `Iniciativa integral que impulsa el espíritu emprendedor en jóvenes de 18 a 30 años.

      Componentes del programa:
      1. Capacitación empresarial (3 meses)
         - Desarrollo de plan de negocios
         - Marketing digital
         - Finanzas y contabilidad básica
         - Aspectos legales y tributarios

      2. Mentoría personalizada (6 meses)
         - Acompañamiento de empresarios exitosos
         - Sesiones semanales
         - Networking con otros emprendedores

      3. Financiamiento
         - Microcréditos desde $500 hasta $5,000
         - Tasas preferenciales
         - Plazo de pago flexible

      4. Seguimiento post-inversión
         - Asesoría continua
         - Evaluación trimestral
         - Capacitaciones adicionales

      Resultados:
      - 200 emprendimientos apoyados
      - Tasa de éxito del 75% al primer año
      - Generación de 600 empleos
      - Facturación conjunta de $2 millones anuales

      Sectores apoyados: tecnología, gastronomía, artesanía, servicios, comercio y agricultura.`,
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      publishDate: new Date('2023-12-01'),
      isActive: true
    },
    {
      id: '6',
      title: 'Talleres de Arte para Niños',
      shortDescription: 'Desarrollo de habilidades artísticas en la infancia',
      content: `Programa educativo que fomenta la creatividad y expresión artística en niños de 6 a 14 años.

      Disciplinas artísticas:
      - Pintura y dibujo
      - Música (instrumentos y canto)
      - Teatro y expresión corporal
      - Danza folclórica
      - Artesanía y manualidades
      - Fotografía básica

      Metodología:
      - Clases grupales de 15-20 niños
      - 2 sesiones semanales de 2 horas
      - Profesores especializados en pedagogía artística
      - Enfoque lúdico y participativo

      Beneficios observados:
      - Mejora en autoestima y confianza
      - Desarrollo de habilidades sociales
      - Mejor rendimiento académico
      - Reducción de comportamientos agresivos
      - Descubrimiento de talentos

      Eventos:
      - Exposiciones trimestrales
      - Presentaciones de fin de año
      - Participación en festivales culturales

      Completamente gratuito para familias en situación vulnerable.`,
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
      publishDate: new Date('2024-05-12'),
      isActive: false
    },
    {
      id: '7',
      title: 'Alfabetización Digital para Adultos Mayores',
      shortDescription: 'Inclusión tecnológica de la tercera edad',
      content: `Programa de capacitación tecnológica diseñado específicamente para personas de 60 años en adelante.

      Contenido de los cursos:
      - Uso básico de computadoras y tablets
      - Navegación por internet
      - Correo electrónico
      - Redes sociales (Facebook, WhatsApp)
      - Videollamadas (Zoom, Google Meet)
      - Trámites en línea
      - Banca electrónica segura
      - Identificación de fraudes digitales

      Metodología adaptada:
      - Ritmo pausado y personalizado
      - Grupos reducidos (máx. 10 personas)
      - Material didáctico con letra grande
      - Paciencia y empatía del instructor
      - Práctica intensiva

      Resultados:
      - 500+ adultos mayores capacitados
      - 90% de satisfacción
      - Mejora en comunicación con familiares
      - Mayor autonomía e independencia
      - Reducción de aislamiento social

      Los participantes reportan sentirse más conectados con el mundo actual y con mayor confianza 
      para realizar gestiones digitales sin ayuda.`,
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      publishDate: new Date('2024-06-18'),
      isActive: true
    },
    {
      id: '8',
      title: 'Reforestación Sierra Verde',
      shortDescription: 'Recuperación de bosques nativos en zona montañosa',
      content: `Proyecto ambiental de largo plazo para restaurar el ecosistema forestal de la Sierra Verde.

      Objetivos ambientales:
      - Plantar 50,000 árboles nativos
      - Recuperar 200 hectáreas de bosque
      - Proteger fuentes de agua
      - Conservar biodiversidad local
      - Crear corredores biológicos

      Especies plantadas:
      - Robles, pinos, cedros
      - Arbustos nativos
      - Plantas medicinales
      - Especies en peligro de extinción

      Actividades complementarias:
      - Jornadas de voluntariado
      - Educación ambiental en escuelas
      - Monitoreo científico
      - Vivero comunitario
      - Mantenimiento de senderos

      Impacto esperado:
      - Captura de 10,000 toneladas de CO2 anuales
      - Aumento del 30% en biodiversidad
      - Mejora en calidad y cantidad de agua
      - Generación de 50 empleos verdes

      Se trabaja en alianza con universidades, gobierno local y comunidades indígenas de la zona.`,
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
      publishDate: new Date('2024-07-22'),
      isActive: true
    }
  ];

  // ==========================================
  // DATOS MOCK - SUPPORT INFO
  // ==========================================
  private mockSupportInfo: SupportInfo[] = [
    {
      id: '1',
      type: 'bank_account',
      title: 'Banco Industrial',
      description: 'Cuenta monetaria en quetzales para donaciones nacionales',
      bankName: 'Banco Industrial',
      accountNumber: '1234-5678-9012',
      accountHolder: 'Fundación Esperanza',
      accountType: 'Monetaria',
      isActive: true
    },
    {
      id: '2',
      type: 'bank_account',
      title: 'Banrural',
      description: 'Cuenta de ahorro para donaciones y proyectos especiales',
      bankName: 'Banrural',
      accountNumber: '9876-5432-1098',
      accountHolder: 'Fundación Esperanza',
      accountType: 'Ahorro',
      isActive: true
    },
    {
      id: '3',
      type: 'bank_account',
      title: 'BAC Credomatic',
      description: 'Cuenta en dólares para donaciones internacionales',
      bankName: 'BAC Credomatic',
      accountNumber: '5555-4444-3333',
      accountHolder: 'Fundación Esperanza',
      accountType: 'Ahorro USD',
      isActive: true
    },
    {
      id: '4',
      type: 'other',
      title: 'Voluntariado',
      description: 'Únete como voluntario en nuestros proyectos y marca la diferencia en tu comunidad. Ofrecemos oportunidades en educación, salud, medio ambiente y desarrollo comunitario.',
      icon: 'volunteer',
      contactInfo: 'voluntariado@fundacion.org | Tel: 2222-3333',
      isActive: true
    },
    {
      id: '5',
      type: 'other',
      title: 'Donación en Especie',
      description: 'Recibimos alimentos no perecederos, ropa en buen estado, útiles escolares, materiales de construcción y equipo médico. Todas las donaciones son documentadas y entregadas directamente a las comunidades.',
      icon: 'donation',
      contactInfo: 'donaciones@fundacion.org | Bodega: Zona 12, Ciudad',
      isActive: true
    },
    {
      id: '6',
      type: 'other',
      title: 'Apadrinamiento',
      description: 'Apadrina a un niño o niña y apoya su educación, salud y desarrollo integral. Tu aporte mensual hace una diferencia real en su futuro.',
      icon: 'heart',
      contactInfo: 'apadrinamiento@fundacion.org | Tel: 2222-4444',
      isActive: true
    },
    {
      id: '7',
      type: 'other',
      title: 'Donación de Tiempo Profesional',
      description: 'Si eres profesional en áreas como medicina, educación, tecnología, legal o administración, tu tiempo y conocimiento son invaluables para nuestros proyectos.',
      icon: 'professional',
      contactInfo: 'profesionales@fundacion.org',
      isActive: true
    }
  ];

  // ==========================================
  // DATOS MOCK - SETTINGS
  // ==========================================
  private mockSettings: Setting[] = [
    {
      id: '1',
      key: 'mission',
      value: 'Transformar vidas a través de programas de educación, salud y desarrollo comunitario sostenible.',
      description: 'Misión de la fundación'
    },
    {
      id: '2',
      key: 'vision',
      value: 'Ser un referente de cambio social en Guatemala, construyendo comunidades más fuertes y resilientes.',
      description: 'Visión de la fundación'
    },
    {
      id: '3',
      key: 'values',
      value: 'Compromiso, Transparencia, Solidaridad, Respeto, Integridad',
      description: 'Valores de la fundación'
    },
    {
      id: '4',
      key: 'people_helped',
      value: '5000',
      description: 'Personas beneficiadas'
    },
    {
      id: '5',
      key: 'projects_completed',
      value: '50',
      description: 'Proyectos completados'
    },
    {
      id: '6',
      key: 'communities_supported',
      value: '25',
      description: 'Comunidades apoyadas'
    },
    {
      id: '7',
      key: 'years_of_experience',
      value: '10',
      description: 'Años de experiencia'
    },
    {
      id: '8',
      key: 'address',
      value: 'Ciudad de Guatemala, Guatemala',
      description: 'Dirección física'
    },
    {
      id: '9',
      key: 'phone',
      value: '+502 1234-5678',
      description: 'Teléfono de contacto'
    },
    {
      id: '10',
      key: 'contact_email',
      value: 'info@fundacion.org',
      description: 'Correo de contacto'
    }
  ];

  // ==========================================
  // MÉTODOS PARA PROJECTS
  // ==========================================

  /**
   * Obtiene todos los proyectos como Observable
   */
  getProjects$(): Observable<Project[]> {
    return of([...this.mockProjects]).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Obtiene un proyecto por ID como Observable
   */
  getProjectById$(id: string): Observable<Project | undefined> {
    const project = this.mockProjects.find(p => p.id === id);
    return of(project ? { ...project } : undefined).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Obtiene solo proyectos activos como Observable
   */
  getActiveProjects$(): Observable<Project[]> {
    const active = this.mockProjects.filter(p => p.isActive);
    return of([...active]).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Crea un nuevo proyecto (simulado)
   */
  createProject$(dto: CreateProjectDto): Observable<Project> {
    const newProject: Project = {
      id: Date.now().toString(),
      ...dto,
      isActive: dto.isActive ?? true
    };
    this.mockProjects.push(newProject);
    return of({ ...newProject }).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Actualiza un proyecto existente (simulado)
   */
  updateProject$(dto: UpdateProjectDto): Observable<Project> {
    const index = this.mockProjects.findIndex(p => p.id === dto.id);
    if (index === -1) {
      throw new Error('Proyecto no encontrado');
    }
    this.mockProjects[index] = { ...this.mockProjects[index], ...dto };
    return of({ ...this.mockProjects[index] }).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Elimina un proyecto (simulado)
   */
  deleteProject$(id: string): Observable<void> {
    const index = this.mockProjects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Proyecto no encontrado');
    }
    this.mockProjects.splice(index, 1);
    return of(void 0).pipe(delay(this.DEFAULT_DELAY));
  }

  // ==========================================
  // MÉTODOS PARA SUPPORT INFO
  // ==========================================

  /**
   * Obtiene toda la información de apoyo como Observable
   */
  getSupportInfo$(): Observable<SupportInfo[]> {
    return of([...this.mockSupportInfo]).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Obtiene información de apoyo por tipo
   */
  getSupportInfoByType$(type: SupportType): Observable<SupportInfo[]> {
    const filtered = this.mockSupportInfo.filter(s => s.type === type);
    return of([...filtered]).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Obtiene información de apoyo bancaria
   */
  getBankSupportInfo$(): Observable<SupportInfo[]> {
    return this.getSupportInfoByType$('bank_account');
  }

  /**
   * Obtiene otros tipos de apoyo
   */
  getOtherSupportInfo$(): Observable<SupportInfo[]> {
    return this.getSupportInfoByType$('other');
  }

  /**
   * Crea nueva información de apoyo (simulado)
   */
  createSupportInfo$(dto: CreateSupportInfoDto): Observable<SupportInfo> {
    const newSupport: SupportInfo = {
      id: Date.now().toString(),
      ...dto,
      isActive: dto.isActive ?? true
    };
    this.mockSupportInfo.push(newSupport);
    return of({ ...newSupport }).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Actualiza información de apoyo (simulado)
   */
  updateSupportInfo$(dto: UpdateSupportInfoDto): Observable<SupportInfo> {
    const index = this.mockSupportInfo.findIndex(s => s.id === dto.id);
    if (index === -1) {
      throw new Error('Información de apoyo no encontrada');
    }
    this.mockSupportInfo[index] = { ...this.mockSupportInfo[index], ...dto };
    return of({ ...this.mockSupportInfo[index] }).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Elimina información de apoyo (simulado)
   */
  deleteSupportInfo$(id: string): Observable<void> {
    const index = this.mockSupportInfo.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Información de apoyo no encontrada');
    }
    this.mockSupportInfo.splice(index, 1);
    return of(void 0).pipe(delay(this.DEFAULT_DELAY));
  }

  // ==========================================
  // MÉTODOS PARA SETTINGS
  // ==========================================

  /**
   * Obtiene todas las configuraciones como Observable
   */
  getSettings$(): Observable<Setting[]> {
    return of([...this.mockSettings]).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Obtiene una configuración por clave
   */
  getSettingByKey$(key: string): Observable<Setting | undefined> {
    const setting = this.mockSettings.find(s => s.key === key);
    return of(setting ? { ...setting } : undefined).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Obtiene el valor de una configuración por clave
   */
  getSettingValue$(key: string): Observable<string | undefined> {
    const setting = this.mockSettings.find(s => s.key === key);
    return of(setting?.value).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Crea nueva configuración (simulado)
   */
  createSetting$(dto: CreateSettingDto): Observable<Setting> {
    const newSetting: Setting = {
      id: Date.now().toString(),
      ...dto
    };
    this.mockSettings.push(newSetting);
    return of({ ...newSetting }).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Actualiza configuración (simulado)
   */
  updateSetting$(dto: UpdateSettingDto): Observable<Setting> {
    const index = this.mockSettings.findIndex(s => s.id === dto.id);
    if (index === -1) {
      throw new Error('Configuración no encontrada');
    }
    this.mockSettings[index] = { ...this.mockSettings[index], ...dto };
    return of({ ...this.mockSettings[index] }).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Elimina configuración (simulado)
   */
  deleteSetting$(id: string): Observable<void> {
    const index = this.mockSettings.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Configuración no encontrada');
    }
    this.mockSettings.splice(index, 1);
    return of(void 0).pipe(delay(this.DEFAULT_DELAY));
  }

  // ==========================================
  // MÉTODOS CON SIGNALS (alternativa moderna)
  // ==========================================

  /**
   * Obtiene proyectos como Signal (para uso con toSignal)
   * Uso: projects = toSignal(mockService.getProjectsSignal(), { initialValue: [] })
   */
  getProjectsSignal(): Observable<Project[]> {
    return this.getProjects$();
  }

  /**
   * Obtiene support info como Signal
   */
  getSupportInfoSignal(): Observable<SupportInfo[]> {
    return this.getSupportInfo$();
  }

  /**
   * Obtiene settings como Signal
   */
  getSettingsSignal(): Observable<Setting[]> {
    return this.getSettings$();
  }

  // ==========================================
  // MÉTODOS DE UTILIDAD
  // ==========================================

  /**
   * Reinicia todos los datos a su estado inicial
   */
  resetData(): void {
    // Aquí podrías recargar los datos desde un archivo o API
    console.log('Datos reiniciados');
  }

  /**
   * Obtiene estadísticas generales
   */
  getStatistics$(): Observable<{
    totalProjects: number;
    activeProjects: number;
    totalSupportOptions: number;
    totalSettings: number;
  }> {
    const stats = {
      totalProjects: this.mockProjects.length,
      activeProjects: this.mockProjects.filter(p => p.isActive).length,
      totalSupportOptions: this.mockSupportInfo.length,
      totalSettings: this.mockSettings.length
    };
    return of(stats).pipe(delay(this.DEFAULT_DELAY));
  }

  /**
   * Busca proyectos por término
   */
  searchProjects$(term: string): Observable<Project[]> {
    const lowerTerm = term.toLowerCase();
    const results = this.mockProjects.filter(p => 
      p.title.toLowerCase().includes(lowerTerm) ||
      p.shortDescription.toLowerCase().includes(lowerTerm) ||
      p.content.toLowerCase().includes(lowerTerm)
    );
    return of([...results]).pipe(delay(this.DEFAULT_DELAY));
  }
}
