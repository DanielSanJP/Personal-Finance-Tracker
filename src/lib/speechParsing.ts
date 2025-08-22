import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/constants/categories";

interface Account {
  id: string;
  name: string;
}

interface ParsedFormData {
  amount?: string;
  description?: string;
  incomeSource?: string;
  category?: string;
  account?: string;
  date?: Date;
}

export const parseIncomeFromSpeech = (transcript: string, accounts: Account[]): ParsedFormData => {
  const result: ParsedFormData = {};
  
  // Extract amount (numbers with currency keywords)
  const amountMatch = transcript.match(/(\d+(?:\.\d{2})?)\s*(?:dollars?|bucks?|\$)/i) || 
                     transcript.match(/(\d+(?:\.\d{2})?)/);
  if (amountMatch) {
    result.amount = amountMatch[1];
  }
  
  // Extract income source from predefined categories
  const incomeSources = INCOME_CATEGORIES.map(cat => cat.name.toLowerCase());
  const incomeIds = INCOME_CATEGORIES.map(cat => cat.id.toLowerCase());
  
  // Check for category names first
  const foundSourceName = incomeSources.find(source => 
    transcript.includes(source) || 
    transcript.includes(source.replace(/\s+/g, ''))
  );
  
  // Check for category IDs
  const foundSourceId = incomeIds.find(id => 
    transcript.includes(id) || 
    transcript.includes(id.replace(/-/g, ' '))
  );
  
  if (foundSourceName) {
    const category = INCOME_CATEGORIES.find(cat => 
      cat.name.toLowerCase() === foundSourceName
    );
    result.incomeSource = category?.id;
  } else if (foundSourceId) {
    result.incomeSource = foundSourceId;
  }
  
  // Extract account name
  const accountNames = accounts.map(acc => acc.name.toLowerCase());
  const foundAccount = accountNames.find(accName => 
    transcript.includes(accName)
  );
  if (foundAccount) {
    result.account = accounts.find(acc => 
      acc.name.toLowerCase() === foundAccount
    )?.id;
  }
  
  // Extract date
  result.date = parseDateFromSpeech(transcript);
  
  // Create description from remaining text
  let description = transcript;
  if (amountMatch) description = description.replace(amountMatch[0], '').trim();
  if (foundSourceName) description = description.replace(foundSourceName, '').trim();
  if (foundSourceId) description = description.replace(foundSourceId.replace(/-/g, ' '), '').trim();
  if (foundAccount) description = description.replace(foundAccount, '').trim();
  
  // Clean up common words
  description = description.replace(/\b(add|to|from|for|the|a|an|income|money|dollars?|bucks?)\b/gi, '').trim();
  description = description.replace(/\s+/g, ' ').trim(); // Clean multiple spaces
  
  if (description && description.length > 2) {
    result.description = description.charAt(0).toUpperCase() + description.slice(1);
  }
  
  return result;
};

export const parseExpenseFromSpeech = (transcript: string, accounts: Account[]): ParsedFormData => {
  const result: ParsedFormData = {};
  
  // Extract amount (numbers with currency keywords)
  const amountMatch = transcript.match(/(\d+(?:\.\d{2})?)\s*(?:dollars?|bucks?|\$)/i) || 
                     transcript.match(/(\d+(?:\.\d{2})?)/);
  if (amountMatch) {
    result.amount = amountMatch[1];
  }
  
  // Extract expense category from predefined categories
  const expenseCategories = EXPENSE_CATEGORIES.map(cat => cat.name.toLowerCase());
  const expenseIds = EXPENSE_CATEGORIES.map(cat => cat.id.toLowerCase());
  
  // Check for category names first
  const foundCategoryName = expenseCategories.find(category => 
    transcript.includes(category) || 
    transcript.includes(category.replace(/\s+/g, ''))
  );
  
  // Check for category IDs
  const foundCategoryId = expenseIds.find(id => 
    transcript.includes(id) || 
    transcript.includes(id.replace(/-/g, ' '))
  );
  
  if (foundCategoryName) {
    const category = EXPENSE_CATEGORIES.find(cat => 
      cat.name.toLowerCase() === foundCategoryName
    );
    result.category = category?.id;
  } else if (foundCategoryId) {
    result.category = foundCategoryId;
  }
  
  // Extract account name
  const accountNames = accounts.map(acc => acc.name.toLowerCase());
  const foundAccount = accountNames.find(accName => 
    transcript.includes(accName)
  );
  if (foundAccount) {
    result.account = accounts.find(acc => 
      acc.name.toLowerCase() === foundAccount
    )?.id;
  }
  
  // Extract date
  result.date = parseDateFromSpeech(transcript);
  
  // Create description from remaining text
  let description = transcript;
  if (amountMatch) description = description.replace(amountMatch[0], '').trim();
  if (foundCategoryName) description = description.replace(foundCategoryName, '').trim();
  if (foundCategoryId) description = description.replace(foundCategoryId.replace(/-/g, ' '), '').trim();
  if (foundAccount) description = description.replace(foundAccount, '').trim();
  
  // Clean up common words for expenses
  description = description.replace(/\b(spent|spend|buy|bought|paid|pay|for|the|a|an|expense|money|dollars?|bucks?)\b/gi, '').trim();
  description = description.replace(/\s+/g, ' ').trim(); // Clean multiple spaces
  
  if (description && description.length > 2) {
    result.description = description.charAt(0).toUpperCase() + description.slice(1);
  }
  
  return result;
};

export const parseDateFromSpeech = (transcript: string): Date | undefined => {
  const today = new Date();
  
  if (transcript.includes('yesterday')) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }
  
  if (transcript.includes('today') || transcript.includes('now')) {
    return today;
  }
  
  if (transcript.includes('last week')) {
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    return lastWeek;
  }
  
  if (transcript.includes('last month')) {
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    return lastMonth;
  }
  
  // Handle day names (yesterday, monday, tuesday, etc.)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const foundDay = days.find(day => transcript.includes(day));
  
  if (foundDay) {
    const targetDay = days.indexOf(foundDay);
    const currentDay = today.getDay();
    let daysAgo = currentDay - targetDay;
    
    if (daysAgo <= 0) {
      daysAgo += 7; // If the day hasn't passed this week, go to last week
    }
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysAgo);
    return targetDate;
  }
  
  return undefined;
};
