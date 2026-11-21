import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables FIRST before importing config
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envPath = path.resolve(__dirname, '../.env')

dotenv.config({ path: envPath })

/**
 * Script to check which records are missing URL fields
 * Run with: npx tsx scripts/check-url-fields.ts
 */

async function checkUrlFields() {
  // Dynamic import after env vars are loaded
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')
  
  console.log('🔍 Checking URL fields in all collections...\n')

  const payload = await getPayload({ config })

  // ===== EXPERIENCE COLLECTION =====
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 EXPERIENCE COLLECTION')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const experiences = await payload.find({
    collection: 'experience',
    limit: 1000,
  })

  console.log(`Total records: ${experiences.docs.length}\n`)

  const expWithUrl: string[] = []
  const expWithoutUrl: string[] = []
  const expProjectsWithUrl: Array<{ company: string; project: string }> = []
  const expProjectsWithoutUrl: Array<{ company: string; project: string }> = []

  experiences.docs.forEach((exp) => {
    // Check company URL
    if (exp.url && exp.url.trim() !== '') {
      expWithUrl.push(exp.company)
    } else {
      expWithoutUrl.push(exp.company)
    }

    // Check project URLs
    if (exp.projects && Array.isArray(exp.projects)) {
      exp.projects.forEach((proj: any) => {
        if (proj.url && proj.url.trim() !== '') {
          expProjectsWithUrl.push({ company: exp.company, project: proj.projectName })
        } else {
          expProjectsWithoutUrl.push({ company: exp.company, project: proj.projectName })
        }
      })
    }
  })

  console.log('📊 Company URL Status:')
  console.log(`  ✅ With URL: ${expWithUrl.length}`)
  if (expWithUrl.length > 0) {
    expWithUrl.forEach((c) => console.log(`     - ${c}`))
  }
  console.log(`  ❌ Without URL: ${expWithoutUrl.length}`)
  if (expWithoutUrl.length > 0) {
    expWithoutUrl.forEach((c) => console.log(`     - ${c}`))
  }

  console.log('\n📊 Project URL Status:')
  console.log(`  ✅ With URL: ${expProjectsWithUrl.length}`)
  if (expProjectsWithUrl.length > 0) {
    expProjectsWithUrl.forEach((p) => console.log(`     - ${p.company} / ${p.project}`))
  }
  console.log(`  ❌ Without URL: ${expProjectsWithoutUrl.length}`)
  if (expProjectsWithoutUrl.length > 0) {
    expProjectsWithoutUrl.forEach((p) => console.log(`     - ${p.company} / ${p.project}`))
  }

  // ===== EDUCATION COLLECTION =====
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 EDUCATION COLLECTION')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const education = await payload.find({
    collection: 'education',
    limit: 1000,
  })

  console.log(`Total records: ${education.docs.length}\n`)

  const eduWithUrl: string[] = []
  const eduWithoutUrl: string[] = []

  education.docs.forEach((edu) => {
    if (edu.schoolUrl && edu.schoolUrl.trim() !== '') {
      eduWithUrl.push(edu.school)
    } else {
      eduWithoutUrl.push(edu.school)
    }
  })

  console.log('📊 School URL Status:')
  console.log(`  ✅ With schoolUrl: ${eduWithUrl.length}`)
  if (eduWithUrl.length > 0) {
    eduWithUrl.forEach((s) => console.log(`     - ${s}`))
  }
  console.log(`  ❌ Without schoolUrl: ${eduWithoutUrl.length}`)
  if (eduWithoutUrl.length > 0) {
    eduWithoutUrl.forEach((s) => console.log(`     - ${s}`))
  }


  // ===== SKILLS COLLECTION =====
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 SKILLS COLLECTION')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const skills = await payload.find({
    collection: 'skills',
    limit: 1000,
  })

  console.log(`Total records: ${skills.docs.length}\n`)

  const skillsWithUrl: string[] = []
  const skillsWithoutUrl: string[] = []

  skills.docs.forEach((skill) => {
    if (skill.docsUrl && skill.docsUrl.trim() !== '') {
      skillsWithUrl.push(skill.name)
    } else {
      skillsWithoutUrl.push(skill.name)
    }
  })

  console.log('📊 Documentation URL Status:')
  console.log(`  ✅ With docsUrl: ${skillsWithUrl.length}`)
  if (skillsWithUrl.length > 0) {
    skillsWithUrl.forEach((s) => console.log(`     - ${s}`))
  }
  console.log(`  ❌ Without docsUrl: ${skillsWithoutUrl.length}`)
  if (skillsWithoutUrl.length > 0) {
    skillsWithoutUrl.forEach((s) => console.log(`     - ${s}`))
  }

  // ===== PROJECTS COLLECTION =====
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 PROJECTS COLLECTION (Personal Projects)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const projects = await payload.find({
    collection: 'projects',
    limit: 1000,
  })

  console.log(`Total records: ${projects.docs.length}\n`)

  const projWithDemo: string[] = []
  const projWithoutDemo: string[] = []
  const projWithRepo: string[] = []
  const projWithoutRepo: string[] = []

  projects.docs.forEach((proj) => {
    // Check links.demo
    if (proj.links?.demo && proj.links.demo.trim() !== '') {
      projWithDemo.push(proj.title)
    } else {
      projWithoutDemo.push(proj.title)
    }

    // Check links.repo (bonus info)
    if (proj.links?.repo && proj.links.repo.trim() !== '') {
      projWithRepo.push(proj.title)
    } else {
      projWithoutRepo.push(proj.title)
    }
  })

  console.log('📊 Demo URL Status (links.demo):')
  console.log(`  ✅ With demo URL: ${projWithDemo.length}`)
  if (projWithDemo.length > 0) {
    projWithDemo.forEach((p) => console.log(`     - ${p}`))
  }
  console.log(`  ❌ Without demo URL: ${projWithoutDemo.length}`)
  if (projWithoutDemo.length > 0) {
    projWithoutDemo.forEach((p) => console.log(`     - ${p}`))
  }

  console.log('\n📊 Repo URL Status (links.repo) [bonus info]:')
  console.log(`  ✅ With repo URL: ${projWithRepo.length}`)
  if (projWithRepo.length > 0) {
    projWithRepo.forEach((p) => console.log(`     - ${p}`))
  }
  console.log(`  ❌ Without repo URL: ${projWithoutRepo.length}`)
  if (projWithoutRepo.length > 0) {
    projWithoutRepo.forEach((p) => console.log(`     - ${p}`))
  }

  // ===== SUMMARY =====
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📝 SUMMARY')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  console.log(`Experience companies without URL: ${expWithoutUrl.length}`)
  console.log(`Experience projects without URL: ${expProjectsWithoutUrl.length}`)
  console.log(`Education schools without URL: ${eduWithoutUrl.length}`)
  console.log(`Skills without docsUrl: ${skillsWithoutUrl.length}`)
  console.log(`Projects without links.demo: ${projWithoutDemo.length}`)

  console.log('\n✅ Check complete!')

  process.exit(0)
}

checkUrlFields().catch((error) => {
  console.error('❌ Error checking URL fields:', error)
  process.exit(1)
})
