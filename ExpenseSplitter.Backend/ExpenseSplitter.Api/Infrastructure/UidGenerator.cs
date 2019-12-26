using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ExpenseSplitter.Api.Infrastructure
{
    public interface IUidGenerator
    {
        string Generate(int length, bool allowCharDuplicates, Func<string, bool> duplicateCheck);
    }

    public sealed class UidGenerator : IUidGenerator 
    {
        private const int _maxRetriesCount = 3;

        public string Generate(int length, bool allowCharDuplicates, Func<string, bool> isDuplicate)
        {
            for (var i = 1; i <= _maxRetriesCount; i++)
            {
                var uid = generateNew(length, allowCharDuplicates);
                if (!isDuplicate(uid))
                    return uid;
            }

            throw new Exception($"Could not generate uid after {_maxRetriesCount}");
        }

        private string generateNew(int length, bool allowCharDuplicates)
        {
            var builder = new StringBuilder();
            var characters = getAvailableCharacters();
            var charactersCount = characters.Count();

            if (allowCharDuplicates)
            {
                var random = new Random(Guid.NewGuid().GetHashCode());
                for (var i = 0; i < length; i++)
                    builder.Append(characters.ElementAt(random.Next(charactersCount)));
            }
            else
            {
                if (length > charactersCount)
                    throw new Exception($"Requested too long uid (requested length: {length}, generated length: {charactersCount}");

                characters
                    .OrderBy(e => Guid.NewGuid())
                    .Take(length)
                    .ToList()
                    .ForEach(e => builder.Append(e));
            }

            var uid = builder.ToString();
            return uid;
        }

        private IEnumerable<string> getAvailableCharacters()
        {
            var character = 
                Enumerable
                    .Empty<int>()
                    .Concat(getBoundedCharRange('a', 'z'))
                    .Concat(getBoundedCharRange('A', 'Z'))
                    .Concat(getBoundedCharRange('0', '9'))
                    .Select(x => ((char) x).ToString());

            return character;
        }

        private IEnumerable<int> getBoundedCharRange(char first, char last)
        {
            return Enumerable.Range((int)first, (int)(last - first + 1));
        }
    }
}