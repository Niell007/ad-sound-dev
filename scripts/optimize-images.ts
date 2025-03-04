import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

interface OptimizationOptions {
  quality?: number
  width?: number
  height?: number
  format?: 'jpeg' | 'png' | 'webp'
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  quality: 80,
  format: 'webp'
}

async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizationOptions = DEFAULT_OPTIONS
) {
  try {
    let imageProcessor = sharp(inputPath)
    
    // Get image metadata
    const metadata = await imageProcessor.metadata()
    
    // Resize if needed while maintaining aspect ratio
    if (options.width || options.height) {
      imageProcessor = imageProcessor.resize(options.width, options.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }
    
    // Convert and optimize based on format
    if (options.format === 'webp') {
      imageProcessor = imageProcessor.webp({ quality: options.quality })
    } else if (options.format === 'jpeg') {
      imageProcessor = imageProcessor.jpeg({ quality: options.quality })
    } else if (options.format === 'png') {
      imageProcessor = imageProcessor.png({ quality: options.quality })
    }
    
    // Save the optimized image
    await imageProcessor.toFile(outputPath)
    
    // Calculate size reduction
    const inputSize = fs.statSync(inputPath).size
    const outputSize = fs.statSync(outputPath).size
    const reduction = ((inputSize - outputSize) / inputSize * 100).toFixed(2)
    
    console.log(`✓ Optimized: ${path.basename(inputPath)}`)
    console.log(`  Size reduced by ${reduction}% (${(inputSize/1024).toFixed(2)}KB → ${(outputSize/1024).toFixed(2)}KB)`)
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error)
  }
}

async function optimizeImagesInDirectory(directory: string) {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(directory, 'optimized')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // Find all image files
    const imageFiles = await glob('**/*.{jpg,jpeg,png,webp}', {
      cwd: directory,
      ignore: ['optimized/**', 'node_modules/**']
    })
    
    console.log(`Found ${imageFiles.length} images to optimize...`)
    
    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(directory, file)
      const outputPath = path.join(
        outputDir,
        path.basename(file, path.extname(file)) + '.webp'
      )
      
      await optimizeImage(inputPath, outputPath)
    }
    
    console.log('\nOptimization complete!')
  } catch (error) {
    console.error('Error during optimization:', error)
  }
}

// Run optimization on public directory
const publicDir = path.join(process.cwd(), 'public')
optimizeImagesInDirectory(publicDir)