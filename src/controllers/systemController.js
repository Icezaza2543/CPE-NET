/**
 * System Diagnostics & Telemetry Controller
 * 
 * @module controllers/systemController
 * @description Provides system health metrics, runtime status, and hardware resource indicators.
 */

const os = require('os');

class SystemController {
  /**
   * Get system health and telemetry diagnostics
   * GET /api/v1/system/health
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  getHealthStatus(req, res) {
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = Math.floor(process.uptime());

    const diagnostics = {
      status: 'UP',
      service: 'CPE-NET Backend Service',
      version: '1.0.0',
      uptime: {
        seconds: uptimeSeconds,
        formatted: formatUptime(uptimeSeconds)
      },
      system: {
        platform: process.platform,
        architecture: process.arch,
        nodeVersion: process.version,
        cpuCores: os.cpus().length,
        totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
        freeMemoryMB: Math.round(os.freemem() / (1024 * 1024))
      },
      processMemory: {
        rssMB: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapTotalMB: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
        heapUsedMB: Math.round(memoryUsage.heapUsed / (1024 * 1024))
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: diagnostics
    });
  }
}

/**
 * Formats uptime in seconds to human readable string (e.g., 2d 5h 12m 30s)
 * @param {number} seconds 
 * @returns {string}
 */
function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

module.exports = new SystemController();
