using System;
using ExpenseSplitter.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace ExpenseSplitter.Tests.Setup
{
    public class ContextMock
    {
        public static Context SetupContext()
        {
            var context = CreateInMemoryContext();

            SeedDatabase(context);

            return context;
        }

        private static Context CreateInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<Context>()
                            .UseInMemoryDatabase(Guid.NewGuid().ToString())
                            .Options;
            var context = new Context(options);

            return context;
        }

        private static void SeedDatabase(Context context)
        {
            // Trips
            var romeTrip = new Trip
            {
                Uid = "rome",
                Name = "Rome",
                Description = "2019 June trip to Rome",
                CreatedAt = DateTime.Now.AddDays(-1),
            };

            var berlinTrip = new Trip
            {
                Uid = "berlin",
                Name = "Berlin",
                Description = "2018 December trip to Berlin",
                CreatedAt = DateTime.Now,
            };

            context.Trips.AddRange(romeTrip, berlinTrip);

            // Users
            var andrew = new User
            {
                Nick = "Andrew",
                Email = "andrew@test.pl",
                Password = "10000.e2qqDAlDe8QkqnY4/nN+gA==.XMtVShNIfCFmOl1rTTZYlLUCABZHDliYNaCoO+oI9mw=",
            };

            var bryan = new User
            {
                Nick = "Bryan",
                Email = "bryan@test.pl",
                Password = "10000.e2qqDAlDe8QkqnY4/nN+gA==.XMtVShNIfCFmOl1rTTZYlLUCABZHDliYNaCoO+oI9mw=",
            };

            var carol = new User
            {
                Nick = "Carol",
                Email = "carol@test.pl",
                Password = "10000.e2qqDAlDe8QkqnY4/nN+gA==.XMtVShNIfCFmOl1rTTZYlLUCABZHDliYNaCoO+oI9mw=",
            };

            var diana = new User
            {
                Nick = "Diana",
                Email = "diana@test.pl",
                Password = "10000.e2qqDAlDe8QkqnY4/nN+gA==.XMtVShNIfCFmOl1rTTZYlLUCABZHDliYNaCoO+oI9mw=",
            };

            context.Users.AddRange(andrew, bryan, carol, diana);

            // UserTrips
            var andrewInRome = new TripUser {
                Trip = romeTrip,
                User = andrew,
            };
            var andrewInRomeParticipant = new Participant
            {
                Name = "Andrew Rome",
                Trip = romeTrip,
                User = andrew,
            };

            var bryanInRome = new TripUser {
                Trip = romeTrip,
                User = bryan,
            };
            var bryanInRomeParticipant = new Participant
            {
                Name = "Bryan Rome",
                Trip = romeTrip,
                User = bryan,
            };

            var bryanInBerlin = new TripUser {
                Trip = berlinTrip,
                User = bryan,
            };
            var bryanInBerlinParticipant = new Participant
            {
                Name = "Bryan Berlin",
                Trip = berlinTrip,
                User = bryan,
            };

            var dianaInBerlin = new TripUser {
                Trip = berlinTrip,
                User = diana,
            };
            var dianaInBerlinParticipant = new Participant
            {
                Name = "Diana Berlin",
                Trip = berlinTrip,
                User = diana,
            };

            var carolInBerlin = new TripUser {
                Trip = berlinTrip,
                User = carol,
            };
            var carolInBerlinParticipant = new Participant
            {
                Name = "Carol Berlin",
                Trip = berlinTrip,
                User = carol,
            };

            context.TripsUsers.AddRange(andrewInRome, bryanInRome, bryanInBerlin, dianaInBerlin, carolInBerlin);
            context.TripsParticipants.AddRange(andrewInRomeParticipant, bryanInRomeParticipant, bryanInBerlinParticipant, dianaInBerlinParticipant, carolInBerlinParticipant);

            context.SaveChanges();
        }
    }
}