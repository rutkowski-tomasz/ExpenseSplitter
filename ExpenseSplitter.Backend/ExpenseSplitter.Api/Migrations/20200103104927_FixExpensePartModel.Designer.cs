﻿// <auto-generated />
using System;
using ExpenseSplitter.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ExpenseSplitter.Api.Migrations
{
    [DbContext(typeof(Context))]
    [Migration("20200103104927_FixExpensePartModel")]
    partial class FixExpensePartModel
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ExpenseSplitter.Api.Data.Expense", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("AdderId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(50) CHARACTER SET utf8mb4")
                        .HasMaxLength(50);

                    b.Property<DateTime>("PaidAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("PayerId")
                        .HasColumnType("int");

                    b.Property<string>("TripUid")
                        .HasColumnType("varchar(16) CHARACTER SET utf8mb4");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("AdderId");

                    b.HasIndex("PayerId");

                    b.HasIndex("TripUid");

                    b.ToTable("Expenses");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.ExpensePart", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("ExpenseId")
                        .HasColumnType("int");

                    b.Property<decimal>("Value")
                        .HasColumnType("decimal(12, 2)");

                    b.HasKey("Id");

                    b.HasIndex("ExpenseId");

                    b.ToTable("ExpensesParts");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.ExpensePartParticipant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("ExpensePartId")
                        .HasColumnType("int");

                    b.Property<int>("ParticipantId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ExpensePartId");

                    b.HasIndex("ParticipantId");

                    b.ToTable("ExpensesPartsParticipants");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.Participant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("varchar(20) CHARACTER SET utf8mb4")
                        .HasMaxLength(20);

                    b.Property<string>("TripUid")
                        .HasColumnType("varchar(16) CHARACTER SET utf8mb4");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("TripUid");

                    b.HasIndex("UserId");

                    b.ToTable("TripsParticipants");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.Trip", b =>
                {
                    b.Property<string>("Uid")
                        .HasColumnType("varchar(16) CHARACTER SET utf8mb4")
                        .HasMaxLength(16);

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("varchar(50) CHARACTER SET utf8mb4")
                        .HasMaxLength(50);

                    b.Property<string>("Name")
                        .HasColumnType("varchar(40) CHARACTER SET utf8mb4")
                        .HasMaxLength(40);

                    b.HasKey("Uid");

                    b.ToTable("Trips");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.TripUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("ParticipantId")
                        .HasColumnType("int");

                    b.Property<string>("TripUid")
                        .HasColumnType("varchar(16) CHARACTER SET utf8mb4");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ParticipantId");

                    b.HasIndex("TripUid");

                    b.HasIndex("UserId");

                    b.ToTable("TripsUsers");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .HasColumnType("varchar(50) CHARACTER SET utf8mb4")
                        .HasMaxLength(50);

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Nick")
                        .HasColumnType("varchar(40) CHARACTER SET utf8mb4")
                        .HasMaxLength(40);

                    b.Property<string>("Password")
                        .HasColumnType("varchar(100) CHARACTER SET utf8mb4")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.Expense", b =>
                {
                    b.HasOne("ExpenseSplitter.Api.Data.User", "Adder")
                        .WithMany()
                        .HasForeignKey("AdderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ExpenseSplitter.Api.Data.Participant", "Payer")
                        .WithMany()
                        .HasForeignKey("PayerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ExpenseSplitter.Api.Data.Trip", "Trip")
                        .WithMany("Expenses")
                        .HasForeignKey("TripUid");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.ExpensePart", b =>
                {
                    b.HasOne("ExpenseSplitter.Api.Data.Expense", "Expense")
                        .WithMany("Parts")
                        .HasForeignKey("ExpenseId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.ExpensePartParticipant", b =>
                {
                    b.HasOne("ExpenseSplitter.Api.Data.ExpensePart", "ExpensePart")
                        .WithMany("PartParticipants")
                        .HasForeignKey("ExpensePartId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ExpenseSplitter.Api.Data.Participant", "Participant")
                        .WithMany("ExpenseParticipations")
                        .HasForeignKey("ParticipantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.Participant", b =>
                {
                    b.HasOne("ExpenseSplitter.Api.Data.Trip", "Trip")
                        .WithMany("Participants")
                        .HasForeignKey("TripUid");

                    b.HasOne("ExpenseSplitter.Api.Data.User", null)
                        .WithMany("Participations")
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("ExpenseSplitter.Api.Data.TripUser", b =>
                {
                    b.HasOne("ExpenseSplitter.Api.Data.Participant", "Participant")
                        .WithMany("UsersClaimed")
                        .HasForeignKey("ParticipantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ExpenseSplitter.Api.Data.Trip", "Trip")
                        .WithMany("Users")
                        .HasForeignKey("TripUid");

                    b.HasOne("ExpenseSplitter.Api.Data.User", "User")
                        .WithMany("UserTrips")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
