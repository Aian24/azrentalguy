import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  const dbUrl = process.env.DATABASE_URL;
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = parseInt(process.env.DB_PORT || "3306", 10);
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;

  // If credentials are provided via DATABASE_URL or individual env vars
  if (dbUrl) {
    pool = mysql.createPool({
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
    return pool;
  }

  if (dbUser && dbName) {
    pool = mysql.createPool({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword || "",
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
    return pool;
  }

  return null;
}

export async function queryDb<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const p = getDbPool();
  if (!p) {
    throw new Error("Database not configured. Set DATABASE_URL or DB_USER / DB_NAME in environment.");
  }
  const [rows] = await p.execute(sql, params);
  return rows as T[];
}

export async function executeDb(sql: string, params: any[] = []): Promise<any> {
  const p = getDbPool();
  if (!p) {
    throw new Error("Database not configured. Set DATABASE_URL or DB_USER / DB_NAME in environment.");
  }
  const [result] = await p.execute(sql, params);
  return result;
}

/**
 * Initializes database tables if they do not exist yet on Plesk MariaDB.
 */
export async function initializeDatabase(): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  try {
    // Equipments Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS equipments (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        dailyRate DECIMAL(10,2) NOT NULL,
        weeklyRate DECIMAL(10,2) NOT NULL,
        monthlyRate DECIMAL(10,2) NOT NULL,
        overtimeRate DECIMAL(10,2) NOT NULL DEFAULT 75.00,
        serialNumber VARCHAR(128) NOT NULL,
        engineHours DECIMAL(8,1) NOT NULL DEFAULT 0.0,
        yardStatus VARCHAR(64) NOT NULL DEFAULT 'Available in Yard',
        engineSpecs VARCHAR(255) NOT NULL,
        operatingWeight VARCHAR(128) NOT NULL,
        image TEXT NOT NULL,
        images JSON NULL,
        tagline VARCHAR(255) NULL,
        requiresDigLaw BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Bookings Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(64) PRIMARY KEY,
        equipmentId VARCHAR(64) NOT NULL,
        equipmentName VARCHAR(255) NOT NULL,
        customerName VARCHAR(255) NOT NULL,
        companyName VARCHAR(255) NULL,
        phone VARCHAR(64) NOT NULL,
        email VARCHAR(255) NULL,
        jobsiteAddress VARCHAR(255) NOT NULL,
        startDate VARCHAR(32) NOT NULL,
        endDate VARCHAR(32) NOT NULL,
        status VARCHAR(64) NOT NULL DEFAULT 'reserved',
        quotedAmount DECIMAL(10,2) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        notes TEXT NULL,
        signatureData MEDIUMTEXT NULL,
        auditHash VARCHAR(128) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 48-Hour Reservation Holds Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS reservation_holds (
        id VARCHAR(64) PRIMARY KEY,
        bookingId VARCHAR(64) NULL,
        equipmentId VARCHAR(64) NOT NULL,
        equipmentName VARCHAR(255) NOT NULL,
        customerName VARCHAR(255) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        startDate VARCHAR(32) NOT NULL,
        endDate VARCHAR(32) NOT NULL,
        totalAmount DECIMAL(10,2) NOT NULL,
        hoursRemaining INT NOT NULL DEFAULT 48,
        signatureStatus VARCHAR(64) NOT NULL DEFAULT 'pending',
        expires_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Leads & Pipeline Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS pipeline_leads (
        id VARCHAR(64) PRIMARY KEY,
        customerName VARCHAR(255) NOT NULL,
        companyName VARCHAR(255) NULL,
        phone VARCHAR(64) NOT NULL,
        email VARCHAR(255) NULL,
        equipmentName VARCHAR(255) NOT NULL,
        jobsiteAddress VARCHAR(255) NOT NULL,
        quotedAmount DECIMAL(10,2) NOT NULL,
        stage VARCHAR(64) NOT NULL DEFAULT 'inquired',
        priority VARCHAR(64) NOT NULL DEFAULT 'normal',
        startDate VARCHAR(32) NULL,
        endDate VARCHAR(32) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Dispatches Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS dispatches (
        id VARCHAR(64) PRIMARY KEY,
        customerName VARCHAR(255) NOT NULL,
        companyName VARCHAR(255) NULL,
        phone VARCHAR(64) NOT NULL,
        equipmentName VARCHAR(255) NOT NULL,
        equipmentId VARCHAR(64) NOT NULL,
        jobsiteAddress VARCHAR(255) NOT NULL,
        scheduledDate VARCHAR(32) NOT NULL,
        scheduledTime VARCHAR(64) NOT NULL,
        returnDate VARCHAR(32) NOT NULL,
        driver VARCHAR(128) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(64) NOT NULL DEFAULT 'scheduled',
        type VARCHAR(64) NOT NULL DEFAULT 'delivery',
        notes TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Settings Table
    await p.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id VARCHAR(64) PRIMARY KEY DEFAULT 'primary',
        data LONGTEXT NULL,
        companyName VARCHAR(255) NOT NULL DEFAULT 'AZ Rental Guy (J-Bone Industries)',
        logoUrl VARCHAR(255) NOT NULL DEFAULT '/images/logo.png',
        logoSize INT NOT NULL DEFAULT 32,
        supportPhone VARCHAR(64) NOT NULL DEFAULT '(707) 326-5592',
        supportEmail VARCHAR(255) NOT NULL DEFAULT 'jbone@azrentalguy.com',
        yardAddress VARCHAR(255) NOT NULL DEFAULT '42410 N Cave Creek Rd, Cave Creek, AZ 85331',
        timezone VARCHAR(64) NOT NULL DEFAULT 'America/Phoenix',
        salesTaxRate DECIMAL(6,4) NOT NULL DEFAULT 0.0860,
        damageWaiverRate DECIMAL(6,4) NOT NULL DEFAULT 0.1000,
        deliveryFee DECIMAL(10,2) NOT NULL DEFAULT 150.00,
        securityDeposit DECIMAL(10,2) NOT NULL DEFAULT 500.00,
        pin VARCHAR(64) NOT NULL DEFAULT '1984',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    return false;
  }
}

