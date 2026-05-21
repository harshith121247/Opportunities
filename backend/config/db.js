const mongoose = require('mongoose')

// Migrate applicants from old format [ObjectId] → new format [{ user, status }]
const migrateApplicants = async () => {
    try {
        const collection = mongoose.connection.db.collection('opportunities')
        const opportunities = await collection.find({}).toArray()

        let migrated = 0

        for (const opp of opportunities) {
            if (!opp.applicants || opp.applicants.length === 0) continue

            const needsMigration = opp.applicants.some((a) => !a.user)
            if (!needsMigration) continue

            const newApplicants = opp.applicants.map((a) =>
                a.user ? a : { user: a, status: 'pending', appliedAt: opp.createdAt || new Date() }
            )

            await collection.updateOne(
                { _id: opp._id },
                { $set: { applicants: newApplicants } }
            )
            migrated++
        }

        if (migrated > 0) {
            console.log(`Migrated applicants in ${migrated} opportunit${migrated > 1 ? 'ies' : 'y'}`.green)
        }
    } catch (err) {
        console.error('Migration error:'.red, err.message)
    }
}

const connectDB = async () => {

    try {

        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)

        await migrateApplicants()

    } catch (error) {

        console.log(error)

        process.exit(1)
    }
}

module.exports = connectDB