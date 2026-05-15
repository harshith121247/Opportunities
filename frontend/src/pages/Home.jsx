import { Link } from 'react-router-dom'

function Home() {

   return (

      <>

         <section className='landing-hero'>

            <div className='hero-badge'>

               Student & Faculty Collaboration Platform

            </div>

            <h1>

               UNLOCK YOUR
               <span> OPPORTUNITIES.</span>

            </h1>

            <p>

               One platform for projects,
               hackathons, internships,
               research collaborations,
               competitions and campus growth.

            </p>

            <div className='hero-buttons'>

               <Link
                  to='/register'
                  className='btn'
               >

                  Get Started

               </Link>

               <Link
                  to='/login'
                  className='btn btn-outline'
               >

                  Sign In

               </Link>

            </div>

            <div className='hero-points'>

               <span>
                  ✓ Student Projects
               </span>

               <span>
                  ✓ Research Collaboration
               </span>

               <span>
                  ✓ Hackathons
               </span>

               <span>
                  ✓ Internships
               </span>

            </div>

         </section>

         <section className='stats-section'>

            <h2>Platform Snapshot</h2>

            <p>
               Building stronger campus
               collaboration and innovation.
            </p>

            <div className='stats-grid'>

               <div className='stat-card'>

                  <h1>100+</h1>

                  <p>
                     Opportunities Shared
                  </p>

               </div>

               <div className='stat-card'>

                  <h1>50+</h1>

                  <p>
                     Student Collaborations
                  </p>

               </div>

               <div className='stat-card'>

                  <h1>20+</h1>

                  <p>
                     Faculty Research Posts
                  </p>

               </div>

               <div className='stat-card'>

                  <h1>500+</h1>

                  <p>
                     Campus Users
                  </p>

               </div>

            </div>

         </section>

         <section className='features-section'>

            <div className='section-badge'>
               PLATFORM FEATURES
            </div>

            <h2>
               Everything Needed for
               Campus Collaboration
            </h2>

            <div className='features-grid'>

               <div className='feature-card'>

                  <h3>
                     Discover Opportunities
                  </h3>

                  <p>

                     Browse projects,
                     internships, hackathons,
                     competitions and more.

                  </p>

               </div>

               <div className='feature-card'>

                  <h3>
                     Apply Instantly
                  </h3>

                  <p>

                     Apply directly and connect
                     with opportunity creators
                     through the platform.

                  </p>

               </div>

               <div className='feature-card'>

                  <h3>
                     Faculty Research
                  </h3>

                  <p>

                     Faculty members can post
                     research collaborations,
                     internships and initiatives.

                  </p>

               </div>

            </div>

         </section>

      </>

   )
}

export default Home