-- Create table for Plan Lector books
CREATE TABLE IF NOT EXISTS plan_lector_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course VARCHAR(50) NOT NULL, -- '1º Básico', '2º Básico', etc.
  category VARCHAR(255), -- 'Narrativa de aventura', 'Obra policial', etc.
  unit VARCHAR(255), -- 'Unidad 0', 'Unidad 1: texto no literario', etc.
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  editorial VARCHAR(255),
  is_choice BOOLEAN DEFAULT false, -- Si es "Elegir uno de estos"
  choice_group INTEGER, -- Para agrupar opciones de elección
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT, -- Notas adicionales como "Se leen las dos obras"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_plan_lector_course ON plan_lector_books(course);
CREATE INDEX IF NOT EXISTS idx_plan_lector_category ON plan_lector_books(category);
CREATE INDEX IF NOT EXISTS idx_plan_lector_order ON plan_lector_books(order_index);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_plan_lector_books_updated_at ON plan_lector_books;
CREATE TRIGGER update_plan_lector_books_updated_at
    BEFORE UPDATE ON plan_lector_books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE plan_lector_books ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Allow public read on plan_lector_books" ON plan_lector_books;
CREATE POLICY "Allow public read on plan_lector_books"
  ON plan_lector_books FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on plan_lector_books" ON plan_lector_books;
CREATE POLICY "Allow authenticated insert on plan_lector_books"
  ON plan_lector_books FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on plan_lector_books" ON plan_lector_books;
CREATE POLICY "Allow authenticated update on plan_lector_books"
  ON plan_lector_books FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete on plan_lector_books" ON plan_lector_books;
CREATE POLICY "Allow authenticated delete on plan_lector_books"
  ON plan_lector_books FOR DELETE
  USING (true);

-- Insert initial data for 1º Básico
INSERT INTO plan_lector_books (course, title, author, editorial, is_choice, choice_group, order_index) VALUES
('1º Básico', 'El estofado del lobo', 'Keiko Kasza', 'Norma', true, 1, 1),
('1º Básico', 'No te rías Pepe', 'Keiko Kasza', 'Norma', true, 1, 2),
('1º Básico', 'Día de lluvia', 'Ana María Machado', 'Alfaguara Infantil', true, 2, 3),
('1º Básico', 'El festín de Agustín', 'Mauricio Paredes/Verónica Laymuns', 'Alfaguara Infantil', true, 2, 4),
('1º Básico', 'El problema de Martina', 'María Luisa Silva', 'Alfaguara Infantil', true, 3, 5),
('1º Básico', '¡No funciona la tele!', 'Glen McCoy', 'Alfaguara Infantil', true, 3, 6);

-- Insert initial data for 2º Básico
INSERT INTO plan_lector_books (course, title, author, editorial, order_index) VALUES
('2º Básico', 'Traca traca qué alaraca', 'Paz Corral', 'Zig-Zag', 7),
('2º Básico', 'El doctor Orangután', 'María Luisa Silva', 'Edebé/ Don Bosco', 8);

INSERT INTO plan_lector_books (course, title, author, editorial, is_choice, choice_group, order_index) VALUES
('2º Básico', 'Un deseo para Alberto', 'María Teresa Ferrer', 'Barco de Vapor SM', true, 4, 9),
('2º Básico', 'La receta Perfecta', 'María Teresa Ferrer', 'Barco de Vapor SM', true, 4, 10),
('2º Básico', 'Un perro confundido', 'Cecilia Beuchat', 'Barco de Vapor SM', true, 5, 11),
('2º Básico', 'Amadeo y el abuelo', 'Cecilia Beuchat', 'Barco de Vapor SM', true, 5, 12),
('2º Básico', 'Amadeo va al colegio', 'Cecilia Beuchat', 'Barco de Vapor SM', true, 5, 13),
('2º Básico', 'Amadeo no está sólo', 'Cecilia Beuchat', 'Barco de Vapor SM', true, 5, 14);

INSERT INTO plan_lector_books (course, title, author, editorial, order_index) VALUES
('2º Básico', 'El cóndor y la pastora', 'Marcela Recabarren/Paloma Valdivia', 'Amanuta', 15),
('2º Básico', '¡Ay cuánta me quiero!', 'Mauricio Paredes', 'Alfaguara Infantil', 16),
('2º Básico', 'Jorge habla', 'Dick Smith', 'Barco de Vapor SM', 17),
('2º Básico', 'Libro libre elección', '', '', 18);

-- Insert initial data for 3º Básico
INSERT INTO plan_lector_books (course, title, author, editorial, order_index) VALUES
('3º Básico', '¡Ay, cuánto me vuelvo a querer!', 'Mauricio Paredes', 'Alfaguara Infantil', 19),
('3º Básico', 'La cabaña en el árbol', 'Gillian Cross', 'Alfaguara Infantil', 20),
('3º Básico', 'Julito Cabello', 'Esteban Cabezas', '', 21);

INSERT INTO plan_lector_books (course, title, author, editorial, is_choice, choice_group, order_index) VALUES
('3º Básico', 'El misterio de la casa encantada', 'David A. Adler', 'Barco de Vapor SM', true, 6, 22),
('3º Básico', 'Ramiro mirón o Ratón espía', 'Sara Bertrand', 'Planetalector', true, 6, 23);

INSERT INTO plan_lector_books (course, title, author, editorial, order_index) VALUES
('3º Básico', 'Otelo y el hombre de piel azul', 'Sara Bertrand', 'Alfaguara Infantil', 24),
('3º Básico', 'Las aventuras de Mampato (cualquiera de la serie)', 'Themo Lobos', 'Sudamericana', 25),
('3º Básico', 'Una manzana con historia', 'Osvaldo Schencke / Cecilia Beuchat', 'Zig-Zag', 26),
('3º Básico', 'Libro a elección', '', '', 27);

-- Note: You can continue adding data for other courses following the same pattern
-- This is a starter set to demonstrate the structure

-- ==============================
-- Departamento de Lenguaje - Añadidos por el asistente
-- ==============================

-- 4º Básico
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index) VALUES
('4º Básico', 'Narrativa de aventura', 'Unidad 0: repaso', 'Papelucho', 'Marcela Paz', 'Ed. SM', 28),
('4º Básico', 'Narrativa de misterio', 'Unidad 1: Texto no literario', 'El crimen de la calle Bambi', 'Hernán del Solar', 'Ed. Zigzag', 29),
('4º Básico', 'Narrativa del mundo cotidiano', 'Unidad 1: Texto no literario', 'Seguiremos siendo amigos', 'Paula Danziger', 'Ed. Alfaguara', 30),
('4º Básico', 'Aventura / Historia', 'Unidad 2: Texto narrativo', 'La momia del salar', 'Sara Bertrand', 'Ed. Alfaguara', 31),
('4º Básico', 'Fantasía / Humor', 'Unidad 2: Texto narrativo', 'Charlie y la fábrica de chocolate', 'Roald Dahl', 'Ed. Alfaguara', 32),
('4º Básico', 'Narrativa fantástica', 'Unidad 3: Texto lírico', 'La cama mágica de Bartolo', 'Mauricio Paredes', 'Ed. Santillana', 33),
('4º Básico', 'Narrativa lírica / antología', 'Unidad 3: Texto lírico', 'Antología poética; El lugar más bonito del mundo; Los agujeros negros', 'Varios autores / Ann Cameron / Yolanda Reyes', 'Selección Dpto. Lenguaje / Ed. Alfaguara', 34);

-- 5º Básico
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index) VALUES
('5º Básico', 'Obra de héroes', 'Unidad 0: repaso', 'Caballo loco, campeón del mundo', 'L. Alberto Tamayo', 'EDB', 35),
('5º Básico', 'Novela gráfica', 'Unidad 1: texto no literario', 'Quique Hache detective: el misterio del arquero desaparecido', 'Sergio Gómez', 'Loqueleo Santillana', 36),
('5º Básico', 'Obra policial', 'Unidad 1: texto no literario', 'Trece casos misteriosos / Querido Fantasma', 'Güiraldes - Balcells', 'SM / Barco de Vapor', 37),
('5º Básico', 'Mundo maravilloso / lírico', 'Unidad 2: texto lírico', 'Fantasma de Canterville; Cuentos en versos para niños perversos', 'Oscar Wilde / Roald Dahl', 'ZigZag / Alfaguara', 38),
('5º Básico', 'Mundo fantástico', 'Unidad 2: texto lírico', 'Las Crónicas de Narnia: El león, la bruja y el ropero / Harry Potter y la piedra filosofal', 'C. S. Lewis / J. K. Rowling', 'ZigZag / Salamandra', 39),
('5º Básico', 'Misterio', 'Unidad 3: texto narrativo', 'El Chupacabras de Pirque / Asesinato en el Cannidian Express', 'Pepe Pelayo / Erik Wilson', 'Alfaguara / SM', 40),
('5º Básico', 'Mundo maravilloso', 'Unidad 3: texto narrativo', 'La historia de la gaviota y el gato que le enseñó a volar', 'Luis Sepúlveda', 'Tusquets Editores', 41),
('5º Básico', 'Libro a elección', 'Unidad 4: texto dramático', 'Libro a elección', '', '', 42);

-- 6º Básico
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index) VALUES
('6º Básico', 'Obra policial', 'Unidad 0: repaso', 'Emilia en Chiloé / El misterio de Los Piñones', 'Sergio Gómez / Beatriz García–Huidobro', 'Alfaguara / Norma', 43),
('6º Básico', 'Mundo cotidiano', 'Unidad 1: texto no literario', 'Un mundo de cartón', 'Gloria A. Alegría Ramírez', 'Edebé', 44),
('6º Básico', 'Aventura', 'Unidad 1: texto no literario', 'La vuelta al mundo en 80 días / Veinte mil leguas de viaje submarino', 'Julio Verne', 'Andrés Bello', 45),
('6º Básico', 'Mundo maravilloso', 'Unidad 2: texto lírico', 'Antología poética / Selección Dpto. Lenguaje', 'Varios autores', 'ZigZag', 46),
('6º Básico', 'Clásica', 'Unidad 3: texto narrativo', 'El libro de la selva', 'Rudyard Kipling', 'ZigZag', 47),
('6º Básico', 'Fantástico', 'Unidad 3: texto narrativo', 'El libro del cementerio / Coraline', 'Neil Gaiman', 'Roca Editorial / Salamandra', 48),
('6º Básico', 'Dramático', 'Unidad 4: texto dramático', 'Harry Potter y el legado maldito', 'J. K. Rowling, Jack Thorne y John Tiffany', 'Salamandra', 49),
('6º Básico', 'Libro a elección', 'Unidad 4: texto dramático', 'Libro a elección', '', '', 50);

-- 7º Básico (sugerencias y opciones)
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index, notes) VALUES
('7º Básico', 'Misterio / Ciencia ficción (opciones)', 'Unidad 0', 'Cruzada en jeans', 'Thea Beckman', 'SM', 51, 'Elegir entre opciones'),
('7º Básico', 'Misterio / Ciencia ficción (opciones)', 'Unidad 0', 'Momo', 'Michael Ende', 'Alfaguara/Lo que leo', 52, 'Elegir entre opciones'),
('7º Básico', 'Novela gráfica ciencia ficción', 'Género narrativo', 'Alex Nemo y la hermandad del Nautilus', 'Ortega / Martínez', 'Reservoir Books', 53, NULL),
('7º Básico', 'Mitología', 'Género dramático', 'Dioses y héroes de la mitología griega', 'Ana María Shua', 'Alfaguara/Lo que leo', 54, NULL),
('7º Básico', 'Novela de fantasía y aventura', 'Género narrativo', 'La ciudad de las bestias', 'Isabel Allende', 'Sudamericana', 55, NULL),
('7º Básico', 'Policial', 'Textos no literarios', 'Las aventuras de Sherlock Holmes', 'Arthur Conan Doyle', 'Zig-Zag', 56, NULL),
('7º Básico', 'Principito (sugerencia)', 'Género lírico', 'El Principito', 'A. de Saint Exupéry', 'Zig-Zag / Pehuén', 57, NULL);

-- 8º Básico
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index) VALUES
('8º Básico', 'Narrativa de viaje', 'Unidad 0', 'Horizonte vertical', 'Rodrigo Jordán', 'SM', 58),
('8º Básico', 'Narrativa de viaje', 'Unidad 0', 'El viaje de la marmota', 'Marcelo Simonetti / Beatriz Rojas', 'Alfaguara', 59),
('8º Básico', 'Fantástica', 'Género narrativo', 'Alicia en el país de las maravillas', 'Lewis Carroll', 'Vicens Vives / Zig-Zag', 60),
('8º Básico', 'Terror', 'Género narrativo', 'Los mejores relatos de terror llevados al cine', 'Varios autores', 'Alfaguara/Lo que leo', 61),
('8º Básico', 'Dramático', 'Género dramático', 'Romeo y Julieta', 'William Shakespeare', 'Origo / Zig-Zag', 62),
('8º Básico', 'Distópica', 'Género lírico', 'Fahrenheit 451', 'Ray Bradbury', 'Debolsillo', 63),
('8º Básico', 'Clásica / no literaria', 'Unidad 3', 'El niño con pijama a rayas / El diario de Ana Frank', 'John Boyne / Ana Frank', 'Salamandra / Zig-Zag', 64),
('8º Básico', 'Libro a elección', 'Actividad interior', 'Libro a elección', '', '', 65);

-- I Medio
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index, notes) VALUES
('I Medio', 'Literatura juvenil', 'Texto literario / Narración', 'Los ojos del perro siberiano / Don surgen las sombras', 'Antonio Santa Ana / David Lazcano', 'Norma / SM', 66, 'Elegir entre opciones'),
('I Medio', 'Biografía', 'Texto expositivo', 'Rosa Parks / Elegí vivir', 'Paola Capriolo / Daniela García', 'Vicens Vives / Grijalbo', 67, NULL),
('I Medio', 'Romanticismo', 'Texto literario', 'Selección de cuentos de terror; Selección de Rimas y leyendas', 'E.A. Poe / Gustavo Adolfo Bécquer', 'Selección (PDF enviado por Departamento)', 68, NULL),
('I Medio', 'Epopeya', 'Texto narrativo', 'La odisea', 'Homero', 'Zig Zag', 69, NULL),
('I Medio', 'Obra trágica', 'Texto dramático', 'Edipo Rey / Antígona', 'Sófocles', 'Zig Zag', 70, NULL),
('I Medio', 'Poesía', 'Texto lírico', 'Altazor', 'Vicente Huidobro', 'Origo Ediciones', 71, NULL);

-- II Medio
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index) VALUES
('II Medio', 'Literatura contemporánea latinoamericana', 'Texto literario / Boom Latinoamericano', 'Crónica de una muerte anunciada', 'Gabriel García Márquez', 'DeBolsillo', 72),
('II Medio', 'Literatura contemporánea latinoamericana', 'Texto literario', 'La tregua / El túnel', 'Mario Benedetti / Ernesto Sábato', 'Planeta / Planetalector', 73),
('II Medio', 'Literatura universal', 'Texto narrativo', 'La metamorfosis / El extranjero', 'Franz Kafka / Albert Camus', 'Origo / Planeta lector', 74),
('II Medio', 'Tragedia moderna', 'Texto dramático', 'Hamlet / Macbeth', 'William Shakespeare', 'Origo Ediciones', 75),
('II Medio', 'Ciencia ficción', 'Texto literario / Distopía', 'Un mundo feliz / La granja de los animales', 'Aldous Huxley / George Orwell', 'DeBolsillo / Zig Zag', 76),
('II Medio', 'Biografía', 'Texto no literario', 'El hombre en busca de sentido / La sonrisa de Mandela', 'Viktor Frankl / John Carlin', 'Herder / Debolsillo', 77);

-- III Medio
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index) VALUES
('III Medio', 'Novela', 'Recomendado', 'El guardián entre el centeno', 'J.D. Salinger', 'Edhasa / Alianza editorial', 78),
('III Medio', 'Novela clásica', 'Fragmentos', 'Don Quijote de la Mancha (capítulos seleccionados)', 'Miguel de Cervantes', 'Ediciones varias', 79),
('III Medio', 'Novela', 'Recomendado', 'La metamorfosis', 'Franz Kafka', 'Ediciones varias', 80),
('III Medio', 'Novela', 'Recomendado', 'Aura', 'Carlos Fuentes', 'Ediciones varias', 81),
('III Medio', 'Cuentos (selección)', 'Semestre', 'Selección de cuentos (Rulfo, Cortázar, Borges, Benedetti, Ocampo, Lispector, Ferré, Ribeyro)', 'Varios autores', 'Ediciones varias', 82),
('III Medio', 'Novela', 'Recomendado', 'La amortajada', 'María Luisa Bombal', 'Ediciones varias', 83),
('III Medio', 'Novela', 'Recomendado', 'La muerte de Iván Ilich', 'Leon Tolstoi', 'Ediciones varias', 84),
('III Medio', 'Ensayo', 'Semestre', 'Ser niño huacho en la historia de Chile', 'Gabriel Salazar', 'Ediciones varias', 85),
('III Medio', 'Dramático', 'Semestre', 'Flores de papel', 'Egon Wolff', 'Ediciones varias', 86),
('III Medio', 'Novela chilena', 'Recomendado', 'Hijo de ladrón', 'Manuel Rojas', 'Zig Zag', 87);

-- IV Medio
INSERT INTO plan_lector_books (course, category, unit, title, author, editorial, order_index) VALUES
('IV Medio', 'Novela latinoamericana', 'Recomendado', 'Pedro Páramo / Cien años de soledad / El lugar sin límites', 'Juan Rulfo / Gabriel García Márquez / José Donoso', 'Ediciones varias', 88),
('IV Medio', 'Dramático', 'Recomendado', 'Hamlet', 'William Shakespeare', 'Origo Ediciones', 89),
('IV Medio', 'Cuento', 'Selección', 'El Aleph; La señorita Cora; Carta a una señorita en París', 'Jorge Luis Borges', 'Ediciones varias', 90),
('IV Medio', 'Novela', 'Recomendado', 'La vida privada de los árboles', 'Alejandro Zambra', 'Ediciones varias', 91),
('IV Medio', 'Ensayo', 'Recomendado', 'Siútico; Los hijos de la Malinche; Ser niño huacho en la historia de Chile', 'Oscar Contardo; Octavio Paz; Gabriel Salazar', 'Ediciones varias', 92),
('IV Medio', 'Novela rusa', 'Recomendado', 'La muerte de Iván Ilich', 'Leon Tolstoi', 'Ediciones varias', 93);

-- Fin de inserciones adicionales del Departamento de Lenguaje

-- Limpieza: eliminar duplicados existentes dejando el primer registro por (course,title,author,editorial)
WITH duplicates AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY course, title, author, editorial ORDER BY created_at, id) AS rn
  FROM plan_lector_books
)
DELETE FROM plan_lector_books WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

-- Crear índice único para evitar duplicados en el futuro
CREATE UNIQUE INDEX IF NOT EXISTS idx_plan_lector_unique ON plan_lector_books(course, title, author, editorial);
