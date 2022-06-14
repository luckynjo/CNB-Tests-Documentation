#!/usr/local/bin/perl

use JSON;
use Cwd;
use WebCNP::Config;
use WWW::Auth;
use WWW::Auth::DB;
require 'webcnp_lib.pl';
use Encode;
use strict;
use warnings;
=pod

=head1 DESCRIPTION
This module handles Z Score CRUD. The code herein is for creating, reading, updating and deleting surveys. It functions as both model and controller. All viewing functions will be handled by the views themselves. In a way, the hope is to move towards an MVC architecture.
All other modules will be left as they are unless we are given permission to refactor them as well.

=cut

my ($cgi, $CONFIG, $DEBUG, $template, $datetime, $db, $server_type, $server_name) = &init_webcnp('timeline.pl');


my $dbh = $db->{_dbh};

my %vars = (
    CONFIG => $CONFIG,
    server_type => $server_type,
    server_name => $server_name,
    server_url => $CONFIG->{server}->{url},
    script => '/timeline.pl'
);

# only returns upon successful authentication
#my ($adminid, $http_header_hashref) = check_login($cgi, \%vars, 'zscores', $template, 'zscores.pl', $db);
my %invalid_request = ("status" => 400, "message" => "There was an error processing your request. Please try again later.");
my %invalid_upload_request = ("status" => 400, "message" => "There was an error uploading the file. Please check your input and try again.");
my %success_request = ("status" => 400, "message" => "Content was updated successfully.");
my $raw_data = $cgi->param('POSTDATA');

if($cgi->param('file'))
{
  print STDERR "FIle is " . $cgi->param('file') . " and data is  " . $cgi->param('file_data') . "\n";
  my @file_lines = ();
  print STDERR "Here we are uploadinf\n";
  my $file = $cgi->upload('file');
  while(<$file>)
  {
    my $line = $_;
    $line =~ s/\n//;
    print STDERR "Given line " . $line . "\n";
    if(!$line =~ /^\s*$/)
    {
      push @file_lines, $line;
    }
    else{
      print STDERR "Here is missing line $line \n";
    }
  }
  close($file);
  print STDERR join("----", @file_lines);

  # TO DO: Save the file to in the CNB git repository as well as its path.
  # Process given file contents and get ready to insert into database.
  # This code should be moved to its own method.
  my @content = ();
  my @sections = ();
  my $count = 0;
  my $section_number = 1;
  # Start with no section.
  my $section = undef;
  my ($test, $version, $language);
  my $title;
  my $prev_title;
  my $document_id;
  my $prev_document_id;
  my $test_version;
  for my $line(@file_lines)
  {
    if($count == 0)
    {
      my @x = split ':', $line;
      my $val = $x[1];
      $val =~ s/ //;
      $test = $val;
    }
    elsif($count == 1)
    {
      my @x = split ':', $line;
      my $val = $x[1];
      $val =~ s/ //;
      my @version_content = split '.', $val;
      $version = $version_content[0];
      $test_version = get_test_version_by_title_version($test, $version);
      print STDERR "Found test version " . $test_version->{title} . "\n";
      if(!$test_version)
      {
        print STDERR "Test version does not exist.\n";
        on_error(\%invalid_upload_request);
      }
    }
    elsif($count == 2)
    {
      my @x = split ':', $line;
      my $val = $x[1];
      $val =~ s/ //;
      $language = $val;
      if(!$language)
      {
        print STDERR "Missing language.\n";
        on_error(\%invalid_upload_request);
      }
    }
    elsif($line =~ m/(^Page [0-9])/i)
    {
      #print STDERR "Given section $title and test $test and content " . join(", ", @content) . "\n";
      print STDERR "Given test version " . $test_version->{id} . "with title ". $test_version->{title} . ", $section_number \n";
      if(scalar @content  > 0)
      {
        # Insert into database.
        # For now this only works for motor praxis.
        #my @sections = @{get_section_by_test_title_and_section_number(1, $title, $section_number)};
        #print STDERR "Must save section translation with title $title and id " . $section->{id} . " plus content  ". join(", ", @content) . "\n";
        print STDERR "Given section with id " . $section->{id} . " and will save content " . join(", ", @content) . "\n";
        save_translation($section->{id}, $language, \@content);
        $section_number = $section->{section_number} + 1;
        @content = ();
        $title = $line;
        $title =~ s/ /_/g;
        print STDERR "Next section title be $title with section number $section_number \n";
        $section = get_test_document($title, $test_version->{id}, $section_number);
        if(!$section)
        {
          print STDERR "No matching section found, exiting.\n";
          on_error(\%invalid_request);
        }
        print STDERR "After saving translation, new section id is " . $section->{id} . " and content " . join(", ", @content) . "\n";
      }
      else
      {
        $title = $line;
        $title =~ s/ /_/g;
        $section = get_test_document($title, $test_version->{id}, $section_number);
        if(!$section)
        {
          print STDERR "No matching section found, exiting.\n";
          on_error(\%invalid_request);
        }
      }
    }
    else
    {
      push @content, $line;
    }
    $count++;
  }
  if($title && scalar @content > 0)
  {
    if($section)
    {
      print STDERR "Must save section with title $title and id " . $section->{id} . " plus content  ". join(", ", @content) . "\n";
      save_translation($section->{id}, $language, \@content);
    }
  }
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%success_request);
  exit;
}
elsif(!$raw_data)
{
  print STDERR "No post data and no file upload, exiting.";
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%invalid_request);
  exit;
}

print STDERR "Data be " . $raw_data . "\n";
my $data = decode_json($raw_data);
print STDERR "Data ke " . $data;

my $action = $data->{op};

if($action eq "view")
{
  my $document_id = $data->{id};
  my $language = $data->{language};
  my $timeline = view_translation($document_id, $language);
  my %results = (
     "section_data" => $timeline
  );
  print $cgi->header('application/json');
  print JSON::XS->new->utf8->encode(\%results);
}
elsif($action eq "save")
{
  my $document_id = $data->{id};
  my $language = $data->{language};
  my $transltion_content = $data->{translation};
  print STDERR "translate based on " . $transltion_content . "\n";
  my $timeline = save_translation($document_id, $language, $transltion_content);
  my %results = (
     "success" => "Your data was saved successfully."
  );
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%results);
}
else
{
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%invalid_request);
}



sub get_test_version_by_title_version
{
  my $test = shift;
  my $version_major = shift;
  my $stmt = "SELECT * FROM test_versions WHERE short_name = ?";

  my @variable_bindings = ($test);

  if($version_major)
  {
    $stmt = "SELECT * FROM test_versions WHERE short_name = ? AND version_major = ?";
    push(@variable_bindings, $version_major);
  }

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }

  return $query->fetchrow_hashref;
}

sub get_section_by_test_title_and_section_number
{
  my $test_version_id = shift;
  my $title = shift;
  my $section_number = shift;
  my $stmt = "SELECT * FROM test_documents WHERE test_version_id = ? AND title = ? and section_number = ?";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my @variable_bindings = ($test_version_id, $title, $section_number);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @translations = ();
  #my $section;
  while(my $translation = $query->fetchrow_hashref)
  {
    print STDERR "Found session $translation\n";
    push(@translations, $translation);
  }
  $query->finish;
  return \@translations;
}

sub get_test_document
{
  my $title = shift;
  my $test_version_id = shift;
  my $section_number = shift;
  my $stmt = "SELECT * FROM test_documents WHERE title = ? and test_version_id = ? and section_number = ?";
  my @variable_bindings = ($title, $test_version_id, $section_number);

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }

  return $query->fetchrow_hashref;
}

sub save_translation
{
  my $document_id = shift;
  my $language = shift;
  my $content = shift;
  my $current_translations = view_translation();

  # Get all the sections for a given test.
  my $stmt = "INSERT INTO test_documents_text(content, document_id, language) VALUES(?, ?, ?)";

  if(scalar @$current_translations > 0)
  {
    $stmt = "UPDATE test_documents_text SET content = ? WHERE document_id = ? AND language = ?";
  }
  print STDERR "Statement be " . $stmt . " with values $document_id, $language, $content\n";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my @variable_bindings = (decode('utf-8', JSON::XS->new->encode($content)), $document_id, $language);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  $query->finish;
}

sub view_translation
{
  my $document_id = shift;
  my $language = shift;
  my $stmt = "SELECT * FROM test_documents_text WHERE document_id = ? AND language = ?";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  my @variable_bindings = ($document_id, $language);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @translations = ();
  #my $section;
  while(my $translation = $query->fetchrow_hashref)
  {
    # Decode JSON content especially for non-latin languages that use different characters.
    $translation->{content} = decode('UTF-8', $translation->{content});
    print STDERR "Found session with content " . $translation->{content} . " \n";
    push(@translations, $translation);
  }
  $query->finish;
  return \@translations;

}


sub on_error
{
  my $error = shift;
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\$error);
}
1;
